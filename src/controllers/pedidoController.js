// src/controllers/pedidoController.js
const db = require('../db');

exports.createPedido = async (req, res) => {
  // Dados que virão do frontend
  const { empresa_id, session_id, nome_cliente, contato_cliente, valor_total, itens } = req.body;

  // Validação básica
  if (!empresa_id || !session_id || !nome_cliente || !itens || itens.length === 0) {
    return res.status(400).json({ error: 'Dados do pedido incompletos.' });
  }

  const client = await db.getClient(); // Pega um cliente do pool de conexões

  try {
    // Inicia a transação
    await client.query('BEGIN');

    // 1. Insere o pedido principal na tabela 'pedidos'
    const pedidoSql = `
      INSERT INTO pedidos (empresa_id, session_id, nome_cliente, contato_cliente, valor_total, status, tipo_entrega)
      VALUES ($1, $2, $3, $4, $5, 'recebido', 'retirada')
      RETURNING id;
    `;
    const pedidoValues = [empresa_id, session_id, nome_cliente, contato_cliente, valor_total];
    const pedidoResult = await client.query(pedidoSql, pedidoValues);
    const novoPedidoId = pedidoResult.rows[0].id;

    // 2. Insere cada item do pedido na tabela 'pedido_itens'
    const itensSql = 'INSERT INTO pedido_itens (pedido_id, produto_id, quantidade, preco_unitario) VALUES ($1, $2, $3, $4)';

    // Usamos Promise.all para executar todas as inserções de itens em paralelo
    await Promise.all(
      itens.map(item => {
        const itemValues = [novoPedidoId, item.id, item.quantity, item.preco];
        return client.query(itensSql, itemValues);
      })
    );

    // Se tudo deu certo, efetiva a transação
    await client.query('COMMIT');

    res.status(201).json({ message: 'Pedido criado com sucesso!', pedidoId: novoPedidoId });

  } catch (error) {
    // Se algo deu errado, desfaz todas as operações da transação
    await client.query('ROLLBACK');
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ error: 'Erro interno ao processar o pedido.' });
  } finally {
    // Libera o cliente de volta para o pool, independente do resultado
    client.release();
  }
};
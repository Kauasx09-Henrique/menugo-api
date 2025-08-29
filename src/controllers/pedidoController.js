const db = require('../db');

// CLIENTE: Cria um novo pedido com status 'aguardando_pagamento'
exports.createPedido = async (req, res) => {
  const { empresa_id, session_id, nome_cliente, contato_cliente, valor_total, itens } = req.body;

  if (!empresa_id || !session_id || !nome_cliente || !itens || !itens.length) {
    return res.status(400).json({ error: 'Dados do pedido incompletos.' });
  }

  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    const pedidoSql = `
      INSERT INTO pedidos (empresa_id, session_id, nome_cliente, contato_cliente, valor_total, status, tipo_entrega)
      VALUES ($1, $2, $3, $4, $5, 'aguardando_pagamento', 'retirada')
      RETURNING id;
    `;
    const pedidoValues = [empresa_id, session_id, nome_cliente, contato_cliente, valor_total];
    const pedidoResult = await client.query(pedidoSql, pedidoValues);
    const novoPedidoId = pedidoResult.rows[0].id;

    const itensSql = 'INSERT INTO pedido_itens (pedido_id, produto_id, quantidade, preco_unitario) VALUES ($1, $2, $3, $4)';

    await Promise.all(
      itens.map(item => client.query(itensSql, [novoPedidoId, item.id, item.quantity, item.preco]))
    );

    await client.query('COMMIT');

    res.status(201).json({ message: 'Pedido criado com sucesso!', pedidoId: novoPedidoId });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ error: 'Erro interno ao processar o pedido.' });
  } finally {
    client.release();
  }
};

// CLIENTE: Obtém um pedido específico para a página de status
exports.getPedidoById = async (req, res) => {
  const { id } = req.params;
  try {
    const sql = `
      SELECT p.*, e.nome as nome_empresa 
      FROM pedidos p
      JOIN empresas e ON p.empresa_id = e.id
      WHERE p.id = $1
    `;
    const { rows } = await db.query(sql, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// --- Funções para o Admin ---
// ... (as suas funções de admin continuam as mesmas)
exports.getPedidosByEmpresa = async (req, res) => {
  const { empresaId } = req.params;
  try {
    const sql = `
      SELECT * FROM pedidos 
      WHERE empresa_id = $1 
      ORDER BY criado_em DESC
    `;
    const { rows } = await db.query(sql, [empresaId]);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao buscar pedidos da empresa:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.updatePedidoStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatus = ['recebido', 'em_preparo', 'pronto', 'finalizado', 'cancelado'];
  if (!status || !validStatus.includes(status)) {
    return res.status(400).json({ error: 'Status inválido.' });
  }

  try {
    const sql = `
      UPDATE pedidos 
      SET status = $1, atualizado_em = CURRENT_TIMESTAMP 
      WHERE id = $2 
      RETURNING *;
    `;
    const { rows } = await db.query(sql, [status, id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado para atualização.' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar status do pedido:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

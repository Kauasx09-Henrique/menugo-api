const db = require('../db');

// CREATE - Criar um novo produto
exports.createProduto = async (req, res) => {
  const { categoria_id, nome, descricao, preco, imagem_url, disponivel } = req.body;
  if (!categoria_id || !nome || !preco) {
    return res.status(400).json({ error: 'Campos "categoria_id", "nome" e "preco" são obrigatórios.' });
  }
  try {
    const sql = 'INSERT INTO produtos (categoria_id, nome, descricao, preco, imagem_url, disponivel) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    const values = [categoria_id, nome, descricao, preco, imagem_url, disponivel];
    const { rows } = await db.query(sql, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// READ - Listar produtos de uma categoria
exports.getProdutosByCategoria = async (req, res) => {
  const { categoriaId } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM produtos WHERE categoria_id = $1 ORDER BY nome ASC', [categoriaId]);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// UPDATE - Atualizar um produto
exports.updateProduto = async (req, res) => {
  const { id } = req.params;
  const { categoria_id, nome, descricao, preco, imagem_url, disponivel } = req.body;
  try {
    const sql = 'UPDATE produtos SET categoria_id = $1, nome = $2, descricao = $3, preco = $4, imagem_url = $5, disponivel = $6 WHERE id = $7 RETURNING *';
    const values = [categoria_id, nome, descricao, preco, imagem_url, disponivel, id];
    const { rows } = await db.query(sql, values);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// DELETE - Excluir um produto
exports.deleteProduto = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM produtos WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

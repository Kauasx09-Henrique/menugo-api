const db = require('../db');

// CREATE - Criar uma nova categoria
exports.createCategoria = async (req, res) => {
  const { empresa_id, nome, ordem } = req.body;
  if (!empresa_id || !nome) {
    return res.status(400).json({ error: 'Os campos "empresa_id" e "nome" são obrigatórios.' });
  }
  try {
    const sql = 'INSERT INTO categorias (empresa_id, nome, ordem) VALUES ($1, $2, $3) RETURNING *';
    const { rows } = await db.query(sql, [empresa_id, nome, ordem]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// READ - Listar todas as categorias de uma empresa
exports.getCategoriasByEmpresa = async (req, res) => {
  const { empresaId } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM categorias WHERE empresa_id = $1 ORDER BY ordem ASC', [empresaId]);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// UPDATE - Atualizar uma categoria
exports.updateCategoria = async (req, res) => {
  const { id } = req.params;
  const { nome, ordem } = req.body;
  try {
    const sql = 'UPDATE categorias SET nome = $1, ordem = $2 WHERE id = $3 RETURNING *';
    const { rows } = await db.query(sql, [nome, ordem, id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Categoria não encontrada.' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// DELETE - Excluir uma categoria
exports.deleteCategoria = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM categorias WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Categoria não encontrada.' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir categoria:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

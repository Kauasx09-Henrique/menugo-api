const db = require('../db');

// CREATE - Adicionar uma nova empresa (com upload de logo e sanitização)
exports.createEmpresa = async (req, res) => {
  // Os dados de texto vêm de req.body
  let { nome, cnpj, telefone, cep, rua, numero, complemento, bairro, cidade, uf } = req.body;

  // O Multer nos dá o arquivo em req.file. Se ele existir, montamos a URL.
  let logo_url = null;
  if (req.file) {
    logo_url = `http://localhost:3000/uploads/${req.file.filename}`;
  }

  if (!nome) {
    return res.status(400).json({ error: 'O campo "nome" é obrigatório.' });
  }

  // --- CORREÇÃO APLICADA AQUI ---
  // Limpa e garante que o CNPJ não exceda o limite do banco de dados.
  if (cnpj) {
    cnpj = cnpj.trim().substring(0, 18);
  }
  // --- FIM DA CORREÇÃO ---

  try {
    const sql = `
      INSERT INTO empresas (nome, cnpj, telefone, logo_url, cep, rua, numero, complemento, bairro, cidade, uf)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
      RETURNING *;
    `;
    const values = [nome, cnpj, telefone, logo_url, cep, rua, numero, complemento, bairro, cidade, uf];

    const { rows } = await db.query(sql, values);
    res.status(201).json(rows[0]);

  } catch (error) {
    console.error('Erro ao criar empresa:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao criar empresa.' });
  }
};

// READ - Listar todas as empresas
exports.getAllEmpresas = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM empresas ORDER BY id ASC');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao buscar empresas:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao buscar empresas.' });
  }
};

// READ - Obter uma empresa por ID
exports.getEmpresaById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM empresas WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Empresa não encontrada.' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar empresa:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao buscar empresa.' });
  }
};

// UPDATE - Atualizar uma empresa (com upload de logo e sanitização)
exports.updateEmpresa = async (req, res) => {
  const { id } = req.params;
  let { nome, cnpj, telefone, logo_url: bodyLogoUrl, cep, rua, numero, complemento, bairro, cidade, uf } = req.body;

  let logo_url = bodyLogoUrl;
  if (req.file) {
    logo_url = `http://localhost:3000/uploads/${req.file.filename}`;
  }

  // --- CORREÇÃO APLICADA AQUI ---
  if (cnpj) {
    cnpj = cnpj.trim().substring(0, 18);
  }
  // --- FIM DA CORREÇÃO ---

  try {
    const sql = `
      UPDATE empresas 
      SET nome = $1, cnpj = $2, telefone = $3, logo_url = $4, cep = $5, rua = $6, numero = $7, 
          complemento = $8, bairro = $9, cidade = $10, uf = $11 
      WHERE id = $12 
      RETURNING *;
    `;
    const values = [nome, cnpj, telefone, logo_url, cep, rua, numero, complemento, bairro, cidade, uf, id];

    const { rows } = await db.query(sql, values);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Empresa não encontrada para atualização.' });
    }
    res.status(200).json(rows[0]);

  } catch (error) {
    console.error('Erro ao atualizar empresa:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao atualizar empresa.' });
  }
};

// DELETE - Deletar uma empresa
exports.deleteEmpresa = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM empresas WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Empresa não encontrada para exclusão.' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar empresa:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao deletar empresa.' });
  }
};

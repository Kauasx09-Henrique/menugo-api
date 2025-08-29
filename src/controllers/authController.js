const jwt = require('jsonwebtoken');
const db = require('../db');

exports.login = async (req, res) => {
  const { email, senha, token } = req.body;

  // --- Cenário 1: Tentativa de login de Super Admin ---
  if (email && senha) {
    if (email === 'admin@gmail.com' && senha === '1234') {
      // Gera um token de sessão para o Super Admin
      const sessionToken = jwt.sign(
        { role: 'super_admin' }, // Identifica o papel como super_admin
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );
      // Retorna o token e um objeto de utilizador genérico
      return res.status(200).json({ token: sessionToken, user: { nome: 'Super Admin', role: 'super_admin' } });
    }
  }

  // --- Cenário 2: Tentativa de login de Empresa por Token ---
  if (token) {
    try {
      // Procura no banco de dados por uma empresa com o token fornecido
      const { rows } = await db.query('SELECT id, nome FROM empresas WHERE token = $1', [token]);

      if (rows.length === 0) {
        return res.status(401).json({ error: 'Código de acesso da empresa inválido.' });
      }

      const empresa = rows[0];

      // Gera o token da sessão para a empresa específica
      const sessionToken = jwt.sign(
        { empresaId: empresa.id, nome: empresa.nome, role: 'empresa_admin' }, // Identifica o papel e o ID da empresa
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );

      // Retorna o token da sessão e os dados da empresa
      return res.status(200).json({ token: sessionToken, user: { ...empresa, role: 'empresa_admin' } });

    } catch (error) {
      console.error('Erro no login da empresa:', error);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  // Se nenhum dos cenários for válido, retorna um erro genérico
  return res.status(401).json({ error: 'Credenciais inválidas.' });
};

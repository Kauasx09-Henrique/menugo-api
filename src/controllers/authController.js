// src/controllers/authController.js
const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
  const { email, senha } = req.body;

  // Verificação de credenciais fixas
  if (email === 'admin@gmail.com' && senha === '1234') {
    // Credenciais corretas: gerar um token JWT
    const token = jwt.sign(
      { userId: 1, role: 'admin' }, // Dados que queremos guardar no token
      process.env.JWT_SECRET, // Nosso segredo
      { expiresIn: '8h' } // Token expira em 8 horas
    );
    return res.status(200).json({ token: token });
  }

  // Credenciais incorretas
  res.status(401).json({ error: 'Email ou senha inválidos.' });
};
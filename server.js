// server.js
const express = require('express');
const cors = require('cors'); // Importando o módulo 'cors'
const path = require('path'); // Importando o módulo 'path'
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares ---
app.use(cors());
app.use(express.json());
// Torna a pasta 'uploads' acessível publicamente
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// --- Rotas da API ---
const authRoutes = require('./src/routes/authRoutes');
const empresaRoutes = require('./src/routes/empresaRoutes');
const categoriaRoutes = require('./src/routes/categoriaRoutes');
const produtoRoutes = require('./src/routes/produtoRoutes');
const pedidoRoutes = require('./src/routes/pedidoRoutes');

app.use('/auth', authRoutes);
app.use('/empresas', empresaRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/produtos', produtoRoutes);
app.use('/pedidos', pedidoRoutes);


// --- Rota Raiz e Inicialização do Servidor ---
app.get('/', (req, res) => {
  res.send('API do MenuGo está no ar!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});

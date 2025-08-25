// server.js
const express = require('express');
const cors = require('cors'); // CORRIGIDO: Importando o módulo 'cors'
const path = require('path'); // CORRIGIDO: Importando o módulo 'path'
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares ---
// Habilita o CORS para permitir que o frontend acesse a API
app.use(cors());
// Habilita o Express para entender requisições com corpo em JSON
app.use(express.json());
// Torna a pasta 'uploads' acessível publicamente para as imagens das logos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// --- Rotas da API ---
// Importa todos os arquivos de rotas
const authRoutes = require('./src/routes/authRoutes');
const empresaRoutes = require('./src/routes/empresaRoutes');
const categoriaRoutes = require('./src/routes/categoriaRoutes');
const produtoRoutes = require('./src/routes/produtoRoutes');
const pedidoRoutes = require('./src/routes/PedidoRoutes');

// Associa cada rota ao seu prefixo de URL
app.use('/auth', authRoutes);
app.use('/empresas', empresaRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/produtos', produtoRoutes);
app.use('/pedidos', pedidoRoutes);


// --- Rota Raiz e Inicialização do Servidor ---
// Rota de teste para a raiz da API
app.get('/', (req, res) => {
  res.send('API do MenuGo está no ar!');
});

// Inicia o servidor na porta definida
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});

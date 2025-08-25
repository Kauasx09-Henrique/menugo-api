// src/routes/pedidoRoutes.js
const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

// Não precisa de autenticação de admin, pois é o cliente que cria o pedido
router.post('/', pedidoController.createPedido);

// Futuramente, você pode criar rotas para o admin ver os pedidos:
// router.get('/', authMiddleware, pedidoController.getAllPedidos);

module.exports = router;
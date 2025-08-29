
const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const authMiddleware = require('../middleware/authMiddleware');

// Rota do Cliente para criar o pedido
router.post('/', pedidoController.createPedido);

// Rota do Cliente para ver o status do seu pedido
router.get('/:id', pedidoController.getPedidoById);

// Rota do Admin para ver todos os pedidos de uma empresa
router.get('/empresa/:empresaId', authMiddleware, pedidoController.getPedidosByEmpresa);

// Rota do Admin para atualizar o status de um pedido
router.put('/:id/status', authMiddleware, pedidoController.updatePedidoStatus);

module.exports = router;
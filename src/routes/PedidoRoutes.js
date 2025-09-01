const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const authMiddleware = require('../middleware/authMiddleware');

// Rota para o CLIENTE criar um pedido (Pública)
router.post('/', pedidoController.createPedido);

// Rota para o CLIENTE ver o status do seu pedido (Pública)
router.get('/:pedidoId', pedidoController.getPedidoById);

// --- NOVAS ROTAS PARA O ADMIN (Protegidas) ---

// Rota para o ADMIN listar todos os pedidos de uma empresa
router.get('/empresa/:empresaId', authMiddleware, pedidoController.getPedidosByEmpresa);

// Rota para o ADMIN atualizar o status de um pedido
router.put('/:pedidoId/status', authMiddleware, pedidoController.updatePedidoStatus);

module.exports = router;

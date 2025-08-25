// Exemplo em src/routes/categoriaRoutes.js
const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const authMiddleware = require('../middleware/authMiddleware'); // <-- IMPORTE O MIDDLEWARE

// Rota para CRIAR (protegida)
router.post('/', authMiddleware, categoriaController.createCategoria);

// Rota para LISTAR (pública)
router.get('/empresa/:empresaId', categoriaController.getCategoriasByEmpresa);

// Rota para ATUALIZAR (protegida)
router.put('/:id', authMiddleware, categoriaController.updateCategoria);

// Rota para DELETAR (protegida)
router.delete('/:id', authMiddleware, categoriaController.deleteCategoria);

module.exports = router;
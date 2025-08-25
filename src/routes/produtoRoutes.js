// src/routes/produtoRoutes.js
const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

// CRIAR um novo produto
router.post('/', produtoController.createProduto);

// LISTAR produtos de uma categoria
router.get('/categoria/:categoriaId', produtoController.getProdutosByCategoria);

// ATUALIZAR um produto por ID
router.put('/:id', produtoController.updateProduto);

// DELETAR um produto por ID
router.delete('/:id', produtoController.deleteProduto);

module.exports = router;
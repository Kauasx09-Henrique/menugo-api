// src/routes/empresaRoutes.js
const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../config/multer'); // Importe a configuração do Multer

// Adicione 'upload.single('logo')' nas rotas de POST e PUT
router.post('/', authMiddleware, upload.single('logo'), empresaController.createEmpresa);
router.get('/', empresaController.getAllEmpresas);
router.get('/:id', empresaController.getEmpresaById);
router.put('/:id', authMiddleware, upload.single('logo'), empresaController.updateEmpresa);
router.delete('/:id', authMiddleware, empresaController.deleteEmpresa);

module.exports = router;
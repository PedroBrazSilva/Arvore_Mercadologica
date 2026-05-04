/**
 * Rotas da API de Departamentos
 * 
 * Define os endpoints HTTP para operações CRUD:
 * - POST /api/departamentos - Criar novo departamento
 * - GET /api/departamentos - Listar todos os departamentos
 * - GET /api/departamentos/:id - Obter departamento por ID
 * - PUT /api/departamentos/:id - Atualizar departamento
 * - DELETE /api/departamentos/:id - Deletar departamento
 */

const express = require('express');
const router = express.Router();
const DepartamentoController = require('../controllers/DepartamentoController');

// POST - Criar novo departamento
router.post('/', DepartamentoController.criar);

// GET - Obter todos os departamentos
router.get('/', DepartamentoController.obterTodos);

// GET - Obter departamento por ID
router.get('/:id', DepartamentoController.obterPorId);

// PUT - Atualizar departamento
router.put('/:id', DepartamentoController.atualizar);

// DELETE - Deletar departamento
router.delete('/:id', DepartamentoController.deletar);

module.exports = router;

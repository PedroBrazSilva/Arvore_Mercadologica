/**
 * Rotas de Departamentos
 * 
 * Define todas as rotas REST para gerenciar departamentos (nós raiz da árvore)
 */

const express = require('express');
const DepartamentoController = require('../controllers/DepartamentoController');

const router = express.Router();

/**
 * POST /api/departamentos
 * Criar novo departamento (raiz)
 */
router.post('/', DepartamentoController.criar);

/**
 * GET /api/departamentos
 * Obter todos os departamentos principais (sem pai)
 */
router.get('/', DepartamentoController.obterTodos);

/**
 * GET /api/departamentos/:id
 * Obter departamento específico por ID
 */
router.get('/:id', DepartamentoController.obterPorId);

/**
 * PUT /api/departamentos/:id
 * Atualizar departamento existente
 */
router.put('/:id', DepartamentoController.atualizar);

/**
 * DELETE /api/departamentos/:id
 * Deletar departamento
 */
router.delete('/:id', DepartamentoController.deletar);

module.exports = router;

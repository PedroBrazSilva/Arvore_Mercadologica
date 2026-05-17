/**
 * Rotas de Categorias
 * 
 * Define todas as rotas REST para gerenciar categorias (nós filhos da árvore)
 */

const express = require('express');
const CategoriaController = require('../controllers/CategoriaController');

const router = express.Router();

/**
 * GET /api/categorias?id_pai=X
 * Obter categorias filhas por id_pai
 */
router.get('/', CategoriaController.obterPorPai);

/**
 * GET /api/categorias/:id
 * Obter categoria específica por ID
 */
router.get('/:id', CategoriaController.obterPorId);

/**
 * POST /api/categorias
 * Criar nova categoria (nó filho)
 */
router.post('/', CategoriaController.criar);

/**
 * PUT /api/categorias/:id
 * Atualizar categoria existente
 */
router.put('/:id', CategoriaController.atualizar);

module.exports = router;

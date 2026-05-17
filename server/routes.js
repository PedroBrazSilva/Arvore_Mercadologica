/**
 * Agregador de Rotas
 * 
 * Este arquivo centraliza todas as rotas da API, combinando:
 * - Rotas de departamentos
 * - Rotas de categorias
 */

const express = require('express');
const router = express.Router();

// Importa os routers de rotas específicas
const departamentosRouter = require('./routes/departamentos');
const categoriasRouter = require('./routes/categorias');

// Monta as rotas na raiz /api
router.use('/departamentos', departamentosRouter);
router.use('/categorias', categoriasRouter);

module.exports = router;

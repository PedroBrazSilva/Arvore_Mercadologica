/**
 * Servidor Express da Árvore Mercadológica
 * 
 * Este arquivo configura e inicia o servidor Node.js que:
 * 1. Fornece a API REST para gerenciar departamentos
 * 2. Conecta-se ao banco de dados MySQL
 * 3. Manipula requisições CORS do frontend
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ========== MIDDLEWARE ==========
// CORS: Permite requisições do frontend
app.use(cors());
// JSON Parser: Converte corpo das requisições em JSON
app.use(express.json());

// ========== ROTAS ==========
// API de departamentos: cadastro, leitura, atualização e deleção
app.use('/api/departamentos', require('./routes/departamentos'));

// Rota de verificação de saúde do servidor
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// ========== INICIALIZAÇÃO ==========
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
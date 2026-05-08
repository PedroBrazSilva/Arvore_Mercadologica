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
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ========== MIDDLEWARE ==========
// CORS: Permite requisições do frontend
app.use(cors());
// JSON Parser: Converte corpo das requisições em JSON
app.use(express.json());

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, '..', 'public')));

// ========== ROTAS ==========
// API unificada: todas as rotas de departamentos e categorias
app.use('/api', require('./routes'));

// Rota de verificação de saúde do servidor
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// ========== INICIALIZAÇÃO ==========
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} — http://localhost:${PORT}/`);
});

// Se a raiz for acessada diretamente, enviar o index.html (útil para desenvolvimento)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});
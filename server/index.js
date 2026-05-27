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

// Importar configuração
const env = require('./config/environment');
const Logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');

const app = express();
const PORT = env.PORT;

// ========== MIDDLEWARE ==========
// CORS: Permite requisições do frontend
app.use(cors());
// JSON Parser: Converte corpo das requisições em JSON
app.use(express.json());
// Request Logger: Log estruturado de requisições
app.use(requestLogger);

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
  const url = `http://localhost:${PORT}`;
  // Mensagem com link clicável usando escape sequence do terminal
  const linkMessage = `\x1b]8;;${url}\x1b\\${url}\x1b]8;;\x1b\\`;
  console.log(`\n✨ Servidor iniciado com sucesso!\n`);
  console.log(`   Abra no navegador: ${linkMessage}\n`);
  Logger.info(`Servidor rodando na porta ${PORT}`, { url });
});

// Se a raiz for acessada diretamente, enviar o index.html (útil para desenvolvimento)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// ========== ERROR HANDLER ==========
// Tratamento de erro global — deve ser o último middleware
app.use(errorHandler);
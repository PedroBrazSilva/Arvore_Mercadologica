/**
 * Middleware de Tratamento de Erro Global
 * 
 * Captura todos os erros não capturados e retorna uma resposta JSON formatada.
 * Deve ser o último middleware a ser adicionado ao Express.
 */

const Logger = require('../utils/logger');
const { HTTP_CODES, ERROR_CODES } = require('../config/constants');

const errorHandler = (err, req, res, next) => {
  // Log do erro
  Logger.error('Unhandled error', err, {
    method: req.method,
    url: req.url,
    ip: req.ip
  });

  // Extrair informações do erro
  const status = err.status || HTTP_CODES.INTERNAL_ERROR;
  const code = err.code || ERROR_CODES.INTERNAL_ERROR;
  const message = err.message || 'Erro interno do servidor';
  const field = err.field || null;

  // Montar resposta
  const response = {
    status: 'error',
    code,
    message
  };

  if (field) {
    response.field = field;
  }

  res.status(status).json(response);
};

module.exports = errorHandler;

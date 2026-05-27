/**
 * Middleware de Log de Requisições
 * 
 * Log estruturado para cada requisição HTTP, incluindo tempo de processamento.
 */

const Logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Capturar fim da resposta
  res.on('finish', () => {
    const duration = Date.now() - start;
    Logger.info(`${req.method} ${req.url}`, {
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip
    });
  });

  next();
};

module.exports = requestLogger;

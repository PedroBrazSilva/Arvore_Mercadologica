/**
 * Erros Customizados
 * 
 * Define classes de erro que estendem Error e incluem
 * status HTTP e códigos de erro para tratamento uniforme.
 */

const { HTTP_CODES, ERROR_CODES } = require('../config/constants');

/**
 * Erro base da aplicação
 */
class AppError extends Error {
  constructor(message, status = HTTP_CODES.INTERNAL_ERROR, code = ERROR_CODES.INTERNAL_ERROR) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

/**
 * Erro de validação (400 Bad Request)
 */
class ValidationError extends AppError {
  constructor(message, field = null) {
    super(message, HTTP_CODES.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    this.field = field;
  }
}

/**
 * Erro de conflito — ex: nome duplicado (409 Conflict)
 */
class ConflictError extends AppError {
  constructor(message) {
    super(message, HTTP_CODES.CONFLICT, ERROR_CODES.DUPLICATE_NAME);
  }
}

/**
 * Erro de recurso não encontrado (404 Not Found)
 */
class NotFoundError extends AppError {
  constructor(resource = 'Recurso') {
    super(`${resource} não encontrado`, HTTP_CODES.NOT_FOUND, ERROR_CODES.NOT_FOUND);
  }
}

module.exports = {
  AppError,
  ValidationError,
  ConflictError,
  NotFoundError
};

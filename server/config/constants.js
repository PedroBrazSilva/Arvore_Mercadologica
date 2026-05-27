/**
 * Constantes Globais do Sistema
 * 
 * Centraliza todos os valores constantes (enums, códigos HTTP, códigos de erro)
 * para evitar números mágicos espalhados no código
 */

const HTTP_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500
};

const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  DUPLICATE_NAME: 'DUPLICATE_NAME',
  PARENT_NOT_FOUND: 'PARENT_NOT_FOUND',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_ERROR: 'INTERNAL_ERROR'
};

const ENTITY_STATUS = {
  ACTIVE: 1,
  INACTIVE: 0
};

const VALIDATION = {
  MIN_NOME_LENGTH: 4,
  MAX_NOME_LENGTH: 120
};

module.exports = {
  HTTP_CODES,
  ERROR_CODES,
  ENTITY_STATUS,
  VALIDATION
};

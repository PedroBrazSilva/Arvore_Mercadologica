/**
 * Validadores Centralizados
 * 
 * Centraliza todas as validações para evitar duplicação
 * e garantir consistência em todo o aplicativo.
 */

const { VALIDATION } = require('../config/constants');

const Validators = {
  /**
   * Valida o campo nome
   * Regras: obrigatório, mínimo de caracteres
   */
  validateNome(nome) {
    if (!nome || nome.trim() === '') {
      return { valid: false, error: 'Nome é obrigatório' };
    }

    const normalized = nome.replace(/\s+/g, ' ').trim();
    if (normalized.length < VALIDATION.MIN_NOME_LENGTH) {
      return {
        valid: false,
        error: `O nome deve possuir pelo menos ${VALIDATION.MIN_NOME_LENGTH} caracteres`
      };
    }

    return { valid: true };
  },

  /**
   * Valida o campo id_pai (ID do pai)
   * Regras: obrigatório, deve ser número
   */
  validateIdPai(id_pai) {
    if (id_pai === undefined || id_pai === null || id_pai === '') {
      return { valid: false, error: 'id_pai é obrigatório' };
    }

    const numId = parseInt(id_pai, 10);
    if (isNaN(numId) || numId <= 0) {
      return { valid: false, error: 'id_pai deve ser um número válido' };
    }

    return { valid: true };
  },

  /**
   * Valida o campo ID
   * Regras: obrigatório, deve ser número positivo
   */
  validateId(id) {
    if (id === undefined || id === null || id === '') {
      return { valid: false, error: 'ID é obrigatório' };
    }

    const numId = parseInt(id, 10);
    if (isNaN(numId) || numId <= 0) {
      return { valid: false, error: 'ID deve ser um número válido' };
    }

    return { valid: true };
  },

  /**
   * Valida movimentação de categoria
   * Regras: categoria e novo_pai devem ser IDs válidos
   * Nota: Verificação de ciclos é feita no repository
   */
  validateMovement(categoriaId, novoIdPai) {
    // Validar ID da categoria
    const catValidation = this.validateId(categoriaId);
    if (!catValidation.valid) {
      return { valid: false, error: `Categoria: ${catValidation.error}` };
    }

    // Novo pai pode ser null ou um ID válido
    if (novoIdPai !== null && novoIdPai !== undefined) {
      const numIdPai = parseInt(novoIdPai, 10);
      if (isNaN(numIdPai) || numIdPai <= 0) {
        return { valid: false, error: 'Novo pai deve ser um número válido' };
      }
    }

    // Validar que não está tentando mover para si mesmo
    if (parseInt(categoriaId, 10) === parseInt(novoIdPai, 10)) {
      return { valid: false, error: 'Não é possível mover uma categoria para si mesma' };
    }

    return { valid: true };
  }
};

module.exports = Validators;

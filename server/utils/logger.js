/**
 * Logger Centralizado
 * 
 * Fornece métodos de logging estruturado para o aplicativo.
 * Todos os logs seguem um formato consistente com timestamp.
 */

const Logger = {
  /**
   * Log de erro com contexto
   * @param {string} message - Mensagem de erro
   * @param {Error} error - Objeto de erro (opcional)
   * @param {object} context - Contexto adicional (opcional)
   */
  error(message, error = null, context = {}) {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, {
      error: error?.message,
      stack: error?.stack,
      ...context
    });
  },

  /**
   * Log de informação
   * @param {string} message - Mensagem
   * @param {object} context - Contexto adicional (opcional)
   */
  info(message, context = {}) {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, context);
  },

  /**
   * Log de debug (apenas em modo debug)
   * @param {string} message - Mensagem
   * @param {object} context - Contexto adicional (opcional)
   */
  debug(message, context = {}) {
    if (process.env.DEBUG === 'true') {
      console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`, context);
    }
  }
};

module.exports = Logger;

/**
 * Configuração de Conexão com Banco de Dados MySQL
 * 
 * Este arquivo estabelece e exporta um pool de conexões com o MySQL.
 * O pool permite reutilizar conexões para melhor desempenho.
 * 
 * Credenciais são carregadas via config/environment.js
 */

const mysql = require('mysql2/promise');
const env = require('./environment');

// Cria um pool de conexões com o MySQL
const pool = mysql.createPool({
  host: env.MYSQL.host,
  port: env.MYSQL.port,
  user: env.MYSQL.user,
  password: env.MYSQL.password,
  database: env.MYSQL.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;

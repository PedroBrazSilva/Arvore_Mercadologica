/**
 * Conexão com Banco de Dados MySQL
 * 
 * Este arquivo estabelece e exporta um pool de conexões com o MySQL.
 * O pool permite reutilizar conexões para melhor desempenho.
 * 
 * Credenciais são carregadas do arquivo .env
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// Cria um pool de conexões com o MySQL
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT, 10) : 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'db_market_tree',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;

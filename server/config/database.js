/**
 * Configuração do Banco de Dados MySQL
 * 
 * Este arquivo estabelece a conexão com o MySQL usando um pool de conexões
 * para melhor desempenho e gerenciamento de recursos.
 * 
 * Credenciais são carregadas do arquivo .env
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// Cria um pool de conexões com o MySQL
// O pool permite reutilizar conexões para melhor eficiência
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
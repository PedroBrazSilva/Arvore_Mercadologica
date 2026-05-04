const pool = require('./config/database');

(async () => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    console.log('Conexão OK:', rows);
    process.exit(0);
  } catch (err) {
    console.error('Erro na conexão com o banco:', err);
    process.exit(1);
  }
})();

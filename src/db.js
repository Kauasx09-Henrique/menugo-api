const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  // Esta é a função que estava a faltar. Ela permite-nos "alugar" uma conexão
  // do pool para fazer múltiplas operações numa única transação.
  getClient: () => pool.connect(),
};

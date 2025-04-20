require('dotenv').config();
const mysql = require('mysql2');

const conexao = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

conexao.connect((erro) => {
  if (erro) {
    console.error('Erro na conexão com o banco:', erro);
  } else {
    console.log('🟢 Conectado ao MySQL com sucesso!');
  }
});

module.exports = conexao;

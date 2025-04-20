const conexao = require('../config/conec');

const Usuario = {
  criar: (email, senhaHash, callback) => {
    const sql = 'INSERT INTO usuarios (email, senha) VALUES (?, ?)';
    conexao.query(sql, [email, senhaHash], callback);
  },

  buscarPorEmail: (email, callback) => {
    const sql = 'SELECT * FROM usuarios WHERE email = ?';
    conexao.query(sql, [email], (erro, resultados) => {
      if (erro) return callback(erro, null);
      if (resultados.length === 0) return callback(null, null);
      callback(null, resultados[0]);
    });
  }
};

module.exports = Usuario;

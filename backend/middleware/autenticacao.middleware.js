const jwt = require('jsonwebtoken');
const segredo = process.env.JWT_SECRET || 'sua_chave_super_secreta';

const autenticar = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ mensagem: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, segredo, (err, usuario) => {
    if (err) {
      return res.status(403).json({ mensagem: 'Token inválido' });
    }

    // Aqui é onde foi extraidoo o ID corretamente
    req.user = { usuario_id: usuario.id }; // ou usuario.usuario_id dependendo de como criou o token

    next();
  });
};

module.exports = autenticar;

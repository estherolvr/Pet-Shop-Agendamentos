const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const conexao = require('../config/conec');

// Registrar
exports.registrar = (req, res) => {
  const { nome, email, senha } = req.body;

  console.log('Requisição recebida para registrar:', req.body);

  if (!nome || !email || !senha) {
    return res.status(400).json({ mensagem: 'Preencha todos os campos' });
  }

  const sqlVerifica = 'SELECT * FROM usuarios WHERE email = ?';
  conexao.query(sqlVerifica, [email], (erro, resultados) => {
    if (erro) {
      return res.status(500).json({ mensagem: 'Erro ao verificar email', erro });
    }

    if (resultados.length > 0) {
      return res.status(400).json({ mensagem: 'Email já cadastrado' });
    }

    bcrypt.hash(senha, 10, (erro, hash) => {
      if (erro) {
        return res.status(500).json({ mensagem: 'Erro ao criptografar senha' });
      }

      const sql = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
      conexao.query(sql, [nome, email, hash], (erro, resultado) => {
        if (erro) {
          return res.status(500).json({ mensagem: 'Erro ao registrar usuário', erro });
        }

        return res.status(201).json({ mensagem: 'Usuário registrado com sucesso' });
      });
    });
  });
};

// Login
exports.login = (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: 'Preencha email e senha' });
  }

  const sql = 'SELECT * FROM usuarios WHERE email = ?';
  conexao.query(sql, [email], (erro, resultados) => {
    if (erro) {
      console.error('Erro na consulta do login:', erro);
      return res.status(500).json({ mensagem: 'Erro no servidor' });
    }

    if (resultados.length === 0) {
      return res.status(401).json({ mensagem: 'Usuário não encontrado' });
    }

    const usuario = resultados[0];

    bcrypt.compare(senha, usuario.senha, (erro, resultado) => {
      if (erro) {
        console.error('Erro ao comparar senha:', erro);
        return res.status(500).json({ mensagem: 'Erro na verificação da senha' });
      }

      if (!resultado) {
        return res.status(401).json({ mensagem: 'Senha incorreta' });
      }

      if (!process.env.JWT_SECRET) {
        return res.status(500).json({ mensagem: 'JWT_SECRET não está definido' });
      }

      const token = jwt.sign(
        { id: usuario.id, nome: usuario.nome },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.status(200).json({ mensagem: 'Login realizado com sucesso', token });
    });
  });
};

// Buscar dados do usuário autenticado
exports.buscarUsuarioPorId = (req, res) => {
  const id = req.params.id;

  const sql = `
  SELECT usuarios.nome, usuarios.email,
    (SELECT COUNT(*) FROM pets WHERE pets.usuario_id = ?) AS total_pets,
    (SELECT COUNT(*) FROM agendamentos 
      JOIN pets ON pets.id = agendamentos.pet_id
      WHERE pets.usuario_id = ?) AS total_agendamentos
  FROM usuarios
  WHERE usuarios.id = ?
`;


  conexao.query(sql, [id, id, id], (erro, resultados) => {
    if (erro) {
      console.error('Erro ao buscar dados do usuário:', erro);
      return res.status(500).json({ mensagem: 'Erro ao buscar dados do usuário', erro });
    }

    if (resultados.length === 0) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    const usuario = resultados[0];

    return res.status(200).json({
      nome: usuario.nome,
      email: usuario.email,
      qtd_pets: usuario.total_pets,
      qtd_agendamentos: usuario.total_agendamentos
    });
  });
};

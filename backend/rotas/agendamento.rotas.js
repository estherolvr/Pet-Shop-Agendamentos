const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { criarAgendamento } = require('../controllers/agendamento.controller');
const autenticarToken = require('../middleware/autenticacao.middleware');
const db = require('../config/conec');
const validarAgendamento = require('../middlewares/validarAgendamento');

// Configuração do multer (upload de imagens)
const armazenamento = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const nomeArquivo = Date.now() + path.extname(file.originalname);
    cb(null, nomeArquivo);
  }
});

const upload = multer({
  storage: armazenamento,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const formatosPermitidos = /jpeg|jpg|png/;
    const mimetype = formatosPermitidos.test(file.mimetype);
    const extname = formatosPermitidos.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Formato de imagem inválido. Apenas JPG e PNG são permitidos.'));
  }
});

// Rota para criar agendamento (com validação!)
router.post(
  '/',
  autenticarToken,
  upload.single('foto_pet'),
  validarAgendamento,
  criarAgendamento
);

// Rota para listar os agendamentos do usuário
router.get('/', autenticarToken, (req, res) => {
  const sql = 'SELECT * FROM agendamentos WHERE usuario_id = ?';
  db.query(sql, [req.user.usuario_id], (error, results) => {
    if (error) {
      console.error('Erro ao listar agendamentos:', error);
      return res.status(500).json({ mensagem: 'Erro ao listar agendamentos', erro: error.message });
    }

    res.status(200).json(results);
  });
});

// Rota para obter detalhes de um agendamento específico
router.get('/:id', autenticarToken, (req, res) => {
  const sql = 'SELECT * FROM agendamentos WHERE id = ? AND usuario_id = ?';
  db.query(sql, [req.params.id, req.user.usuario_id], (error, result) => {
    if (error) {
      console.error('Erro ao buscar agendamento:', error);
      return res.status(500).json({ mensagem: 'Erro ao buscar agendamento', erro: error.message });
    }

    if (!result.length) {
      return res.status(404).json({ mensagem: 'Agendamento não encontrado' });
    }

    res.status(200).json(result[0]);
  });
});

// Rota para excluir um agendamento específico
router.delete('/:id', autenticarToken, (req, res) => {
  const sql = 'DELETE FROM agendamentos WHERE id = ? AND usuario_id = ?';
  db.query(sql, [req.params.id, req.user.usuario_id], (error, result) => {
    if (error) {
      console.error('Erro ao excluir agendamento:', error);
      return res.status(500).json({ mensagem: 'Erro ao excluir agendamento', erro: error.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Agendamento não encontrado' });
    }

    res.status(200).json({ mensagem: 'Agendamento excluído com sucesso' });
  });
});

// Rota para atualizar um agendamento específico
router.put('/:id', autenticarToken, upload.single('foto_pet'), (req, res) => {
  const { nome_pet, raca_pet, data, horario, servico, observacoes } = req.body;
  const id = req.params.id;
  const usuario_id = req.user.usuario_id;
  const foto_pet = req.file ? req.file.filename : null;

  const campos = [];
  const valores = [];

  if (nome_pet) {
    campos.push('nome_pet = ?');
    valores.push(nome_pet);
  }
  if (raca_pet) {
    campos.push('raca_pet = ?');
    valores.push(raca_pet);
  }
  if (data) {
    campos.push('data = ?');
    valores.push(data);
  }
  if (horario) {
    campos.push('horario = ?');
    valores.push(horario);
  }
  if (servico) {
    campos.push('servico = ?');
    valores.push(servico);
  }
  if (observacoes) {
    campos.push('observacoes = ?');
    valores.push(observacoes);
  }
  if (foto_pet) {
    campos.push('foto_pet = ?');
    valores.push(foto_pet);
  }

  if (campos.length === 0) {
    return res.status(400).json({ mensagem: 'Nenhum campo enviado para atualização' });
  }

  valores.push(id, usuario_id);

  const sql = `UPDATE agendamentos SET ${campos.join(', ')} WHERE id = ? AND usuario_id = ?`;

  db.query(sql, valores, (error, result) => {
    if (error) {
      console.error('Erro ao atualizar agendamento:', error);
      return res.status(500).json({ mensagem: 'Erro ao atualizar agendamento', erro: error.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Agendamento não encontrado ou você não tem permissão para editá-lo' });
    }

    res.status(200).json({ mensagem: 'Agendamento atualizado com sucesso' });
  });
});

module.exports = router;

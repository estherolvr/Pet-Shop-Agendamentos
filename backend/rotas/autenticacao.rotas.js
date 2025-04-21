const express = require('express');
const router = express.Router();

const { registrar, login, buscarUsuarioPorId } = require('../controllers/autenticacao.controller');
const autenticar = require('../middleware/autenticacao.middleware');

// Rotas públicas - não precisam de autenticação
router.post('/registrar', registrar); 
router.post('/login', login);

// Rota protegida - precisa de autenticação
router.get('/usuarios/:id', autenticar, buscarUsuarioPorId); 
module.exports = router;

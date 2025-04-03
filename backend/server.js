const express = require('express');
const cors = require('cors');
require('dotenv').config();
const conexao = require('./config/banco.config');

const app = express();
app.use(express.json());
app.use(cors());

// Importa as rotas
const rotasAgendamentos = require('./routes/agendamentos.rotas');
const rotasAutenticacao = require('./routes/autenticacao.rotas');

app.use('/agendamentos', rotasAgendamentos);
app.use('/auth', rotasAutenticacao);

const PORTA = process.env.PORTA || 3000;
app.listen(PORTA, () => {
  console.log(`Servidor rodando na porta ${PORTA}`);
});

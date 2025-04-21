// Carrega variáveis de ambiente
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// ✅ Middlewares globais

app.use(cors({
  origin: [
    'http://127.0.0.1:5500', 
    'http://127.0.0.1:5501',
    'http://localhost:3000',
    'http://localhost:5500',
    'http://localhost:5501'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// ✅ Serve arquivos estáticos da pasta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Importando rotas
const rotasAutenticacao = require('./rotas/autenticacao.rotas');
const rotasAgendamento = require('./rotas/agendamento.rotas'); // Importando a rota de agendamento

// ✅ Usando rotas com prefixo
app.use('/api/usuarios', rotasAutenticacao);
app.use('/api/agendamentos', rotasAgendamento); // Adicionando a rota de agendamento

// ✅ Rota raiz só pra teste
app.get('/', (req, res) => {
  res.send('API funcionando!');
});

// ✅ Porta configurada no .env ou padrão 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

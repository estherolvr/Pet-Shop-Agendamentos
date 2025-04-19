# Bubble Pets 🐾 - Pet Shop Online

<p align="center">
  <img src="https://i.imgur.com/JnQy8Q2.png" alt="Bubble Pets Logo" width="300">
</p>

**Este é um sistema completo de agendamentos desenvolvido para pet shops, permitindo aos clientes agendarem serviços como banhos, tosas e outras atividades para seus pets. O sistema possui autenticação segura e gerenciamento detalhado dos animais, facilitando a administração do pet shop e a experiência do usuário.**

---

## 📌 Índice
- [Funcionalidades](#✨-funcionalidades)
- [Tecnologias](#💻-tecnologias-utilizadas)
- [Pré-requisitos](#📋-pré-requisitos)
- [Instalação](#⚙️-instalação)
- [Estrutura do Projeto](#📂-estrutura-do-projeto)
- [Rotas da API](#🔗-rotas-da-api)
- [Autores](#👥-autores)
- [Licença](#📜-licença)

---

## ✨ Funcionalidades

### 🐶 Para Clientes
- ✅ Cadastro e login seguro com JWT
- 📅 Agendamento de serviços (banho, tosa, etc.)
- 🖼️ Upload de foto do pet
- ✏️ Edição/cancelamento de agendamentos
- 📱 Visualização de histórico

### �️ Para Administradores
- 👁️ Visualização de todos agendamentos
- 🔄 Atualização de status
- 📊 Dashboard de serviços

---

## 💻 Tecnologias Utilizadas

### Frontend
<div style="display: flex; gap: 10px;">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
</div>

### Backend
<div style="display: flex; gap: 10px;">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
</div>

### Segurança
<div style="display: flex; gap: 10px;">
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT">
  <img src="https://img.shields.io/badge/bcrypt-35495E?style=for-the-badge" alt="bcrypt">
</div>

---

## 📋 Pré-requisitos

- Node.js (v16+)
- MySQL (v8+)
- NPM ou Yarn

---

## ⚙️ Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/bubble-pets.git

# Acesse a pasta do projeto
cd bubble-pets

# Instale as dependências
npm install

# Configure o arquivo .env (copie o exemplo)
cp .env.example .env

# Inicie o servidor
npm start

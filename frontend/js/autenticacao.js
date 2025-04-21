function mostrarNotificacao(mensagem, tipo = 'sucesso') {
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao ${tipo}`;
    notificacao.innerText = mensagem;
    document.body.appendChild(notificacao);
  
    setTimeout(() => {
      notificacao.remove();
    }, 3000);
  }
  
  // CADASTRO
  document.querySelector('.formulario-cadastro')?.addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const nome = document.querySelector('#nome-completo').value;
    const email = document.querySelector('#email-cadastro').value;
    const senha = document.querySelector('#senha-cadastro').value;
  
    try {
      const resposta = await fetch('http://localhost:3000/api/usuarios/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
      });
  
      const dados = await resposta.json();
  
      if (resposta.ok) {
        mostrarNotificacao(dados.mensagem || 'Conta criada com sucesso!');
        document.querySelector('.formulario-cadastro').reset();
  
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1500);
      } else {
        mostrarNotificacao(dados.mensagem || 'Erro ao cadastrar.', 'erro');
      }
    } catch (erro) {
      mostrarNotificacao('Erro ao conectar com o servidor.', 'erro');
      console.error(erro);
    }
  });
  
  // LOGIN
  document.querySelector('.formulario-login')?.addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const email = document.querySelector('#email').value;
    const senha = document.querySelector('#senha').value;
  
    try {
      const resposta = await fetch('http://localhost:3000/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });
  
      const dados = await resposta.json();
  
      if (resposta.ok) {
        localStorage.setItem('token', dados.token);
        mostrarNotificacao('Login realizado com sucesso!');
  
        setTimeout(() => {
          window.location.href = 'agendamento.html';
        }, 1000);
      } else {
        mostrarNotificacao(dados.mensagem || 'Erro ao fazer login.', 'erro');
      }
    } catch (erro) {
      mostrarNotificacao('Erro ao conectar com o servidor.', 'erro');
      console.error(erro);
    }
  });
  
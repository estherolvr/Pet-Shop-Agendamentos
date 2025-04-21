let idEditando = null;
let envioEmAndamento = false;
const API_BASE_URL = 'http://localhost:3000'; 

// Elementos do DOM
const dataInput = document.getElementById('dataInput');
const horaInput = document.getElementById('hora');
const formAgendamento = document.getElementById('formAgendamento');


const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBhbGlnbm1lbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzk5OSI+U2VtIEZvdG88L3RleHQ+PC9zdmc+';

// Função para obter URL segura da imagem
function getImageUrl(filename) {
  if (!filename) return PLACEHOLDER_IMAGE;
  
  // Remove '/uploads/' se já estiver presente
  const cleanName = filename.replace(/^\/?uploads\//, '');
  return `${API_BASE_URL}/uploads/${encodeURIComponent(cleanName)}?t=${Date.now()}`;
}

// Função para formatar a data para exibição
function formatarDataParaExibicao(dataString) {
    if (!dataString) return 'Data inválida';

    const data = new Date(dataString);
    if (isNaN(data.getTime())) return 'Data inválida';

    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    };

    return data.toLocaleDateString('pt-BR', options);
}

// Função para formatar a hora (sem os segundos)
function formatarHoraParaExibicao(horaString) {
    if (!horaString) return 'Hora inválida';

    const [hora, minuto] = horaString.split(':').map(Number);
    return `${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`;
}

// Função para mostrar notificações estilizadas
function mostrarNotificacao(mensagem, tipo = 'info') {
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao ${tipo}`;
    notificacao.innerHTML = `
        <span>${mensagem}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(notificacao);
    setTimeout(() => notificacao.remove(), 5000);
}

// Função para validar data em tempo real
function validarData(dataSelecionada) {
    const errorElement = document.getElementById('dataError');
    if (!errorElement) return false;
    
    errorElement.classList.remove('show');
    dataInput.classList.remove('input-error');

    if (!dataSelecionada) {
        mostrarErro('dataError', 'Por favor, selecione uma data');
        return false;
    }

    const hoje = new Date();
    const dataAtual = new Date(hoje.setHours(0, 0, 0, 0));
    const dataAgendamento = new Date(dataSelecionada);
    const limiteMaximo = new Date('2025-12-31');

    if (isNaN(dataAgendamento.getTime())) {
        mostrarErro('dataError', 'Data inválida selecionada');
        return false;
    }

    // Verificar feriados
    const feriados = ['12-24', '12-25', '12-31', '01-01'];
    const mesDia = (dataAgendamento.getMonth() + 1).toString().padStart(2, '0') + '-' + 
                   dataAgendamento.getDate().toString().padStart(2, '0');

    if (feriados.includes(mesDia)) {
        mostrarErro('dataError', 'Não atendemos neste feriado');
        return false;
    }

    if (dataAgendamento < dataAtual) {
        mostrarErro('dataError', 'Não pode agendar para datas passadas');
        return false;
    }

    if (dataAgendamento > limiteMaximo) {
        mostrarErro('dataError', 'Data limite é dezembro/2025');
        return false;
    }

    if (dataAgendamento.getDay() === 0) {
        mostrarErro('dataError', 'Não atendemos aos domingos');
        return false;
    }

    return true;
}

// Função para validar horário em tempo real
function validarHorario(horario) {
    const errorElement = document.getElementById('horaError');
    if (!errorElement) return false;
    
    errorElement.classList.remove('show');
    horaInput.classList.remove('input-error');

    if (!horario) {
        mostrarErro('horaError', 'Por favor, selecione um horário');
        return false;
    }

    const [hora, minuto] = horario.split(':').map(Number);
    
    if (hora < 9 || hora > 17 || (hora === 17 && minuto > 0)) {
        mostrarErro('horaError', 'Atendimento das 09:00 às 17:00');
        return false;
    }

    if (minuto % 15 !== 0) {
        mostrarErro('horaError', 'Horários em intervalos de 15 minutos');
        return false;
    }

    return true;
}

// Função auxiliar para mostrar erros
function mostrarErro(elementId, mensagem) {
    const element = document.getElementById(elementId);
    const inputElement = document.getElementById(elementId.replace('Error', ''));
    
    if (!element || !inputElement) {
        console.error(`Elemento não encontrado: ${elementId}`);
        return;
    }
    
    element.textContent = mensagem;
    element.classList.add('show');
    inputElement.classList.add('input-error');
}

// Função para carregar agendamentos
async function carregarAgendamentos() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_BASE_URL}/api/agendamentos`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Erro ao carregar agendamentos');

        const agendamentos = await response.json();
        const tbody = document.querySelector('.tabela-agendamentos tbody');
        tbody.innerHTML = '';

        if (agendamentos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="sem-agendamentos">
                        Nenhum agendamento encontrado
                    </td>
                </tr>
            `;
            return;
        }

        // Itera sobre os agendamentos e adiciona à tabela
        agendamentos.forEach((item) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div class="agendamento-pet">
                        <img src="${getImageUrl(item.foto_pet)}" 
                             class="miniatura-pet"
                             alt="Foto de ${item.nome_pet}"
                             onerror="this.onerror=null;this.src='${PLACEHOLDER_IMAGE}';this.classList.add('erro-imagem')">
                        <div>
                            <div class="nome_pet">${item.nome_pet}</div>
                            <div class="raca_pet">${item.raca_pet}</div>
                        </div>
                    </div>
                </td>
                <td>${formatarDataParaExibicao(item.data)}</td>
                <td>${formatarHoraParaExibicao(item.horario)}</td>
                <td><span class="status ${item.status.toLowerCase()}">${item.status}</span></td>
                <td class="acoes">
                    <button class="btn-editar" onclick="editarAgendamento(${item.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-excluir" onclick="excluirAgendamento(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error('Erro ao carregar agendamentos:', err);
        mostrarNotificacao('Erro ao carregar agendamentos', 'erro');
    }
}

// Função para excluir agendamento
async function excluirAgendamento(id) {
    if (!confirm('Tem certeza que deseja cancelar este agendamento?')) return;

    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_BASE_URL}/api/agendamentos/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
            mostrarNotificacao('Agendamento cancelado!', 'sucesso');
            await carregarAgendamentos();
        } else {
            const erro = await response.json();
            throw new Error(erro.mensagem || 'Erro ao cancelar');
        }
    } catch (err) {
        console.error('Erro ao excluir agendamento:', err);
        mostrarNotificacao(err.message || 'Erro ao cancelar', 'erro');
    }
}

async function editarAgendamento(id) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_BASE_URL}/api/agendamentos/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Erro ao carregar dados');

        const data = await response.json();
        const form = document.getElementById('formAgendamento');

        // Preenche os campos do formulário
        form.nome_pet.value = data.nome_pet || '';
        form.raca_pet.value = data.raca_pet || '';
        form.data.value = data.data ? new Date(data.data).toISOString().split('T')[0] : '';
        form.horario.value = data.horario ? data.horario.split(':').slice(0, 2).join(':') : ''; // Formatação da hora para edição
        form.servico.value = data.servico || '';
        form.observacoes.value = data.observacoes || '';

        // Atualizar preview da imagem
        const preview = document.getElementById('previewImagem');
        const imgPreview = document.getElementById('imgPreview');

        if (data.foto_pet) {
            imgPreview.src = getImageUrl(data.foto_pet);
            preview.style.display = 'block';

            // Adiciona campo hidden com foto atual
            let fotoAtualInput = document.getElementById('fotoAtual');
            if (!fotoAtualInput) {
                fotoAtualInput = document.createElement('input');
                fotoAtualInput.type = 'hidden';
                fotoAtualInput.id = 'fotoAtual';
                fotoAtualInput.name = 'foto_atual';
                form.appendChild(fotoAtualInput);
            }
            fotoAtualInput.value = data.foto_pet;
        } else {
            preview.style.display = 'none';
        }

        idEditando = id;
        document.getElementById('btn-cancelar-edicao').style.display = 'inline-block';
        document.getElementById('btn-submit').textContent = 'Atualizar Agendamento';
        form.scrollIntoView({ behavior: 'smooth' });

    } catch (err) {
        console.error('Erro ao editar agendamento:', err);
        mostrarNotificacao('Erro ao carregar dados', 'erro');
    }
}

function cancelarEdicao() {
    // Limpa todos os campos do formulário de forma mais completa
    const form = document.getElementById('formAgendamento');
    
    // Reseta o formulário
    form.reset();
    
    // Limpa o preview da imagem
    const preview = document.getElementById('previewImagem');
    const imgPreview = document.getElementById('imgPreview');
    preview.style.display = 'none';
    imgPreview.src = '';
    
    // Remove campos hidden adicionados dinamicamente
    const fotoAtual = document.getElementById('fotoAtual');
    if (fotoAtual) form.removeChild(fotoAtual);
    
    const fotoRemover = document.getElementById('fotoRemover');
    if (fotoRemover) form.removeChild(fotoRemover);
    
    // Reseta o input de arquivo
    const inputFoto = document.getElementById('fotoPet');
    if (inputFoto) inputFoto.value = '';
    
    // Reseta o estado de edição
    idEditando = null;
    
    // Atualiza a interface
    document.getElementById('btn-cancelar-edicao').style.display = 'none';
    document.getElementById('btn-submit').textContent = 'Agendar';
    
    // Limpa eventuais mensagens de erro
    document.getElementById('dataError').classList.remove('show');
    document.getElementById('horaError').classList.remove('show');
    dataInput.classList.remove('input-error');
    horaInput.classList.remove('input-error');
}

// Função para preview de imagem
function previewImagem(input) {
    const preview = document.getElementById('previewImagem');
    const imgPreview = document.getElementById('imgPreview');

    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imgPreview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

async function salvarAgendamento(event) {
    event.preventDefault();

    if (envioEmAndamento) return;
    envioEmAndamento = true;

    const submitBtn = document.getElementById('btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Salvando...';

    try {
        // Validação usando os IDs corretos (consistentes com o formulário HTML)
        if (!document.getElementById('nome_pet').value.trim()) {
            throw new Error('Por favor, insira o nome do pet');
        }
        if (!document.getElementById('raca_pet').value.trim()) {
            throw new Error('Por favor, insira a raça do pet');
        }
        if (!validarData(document.getElementById('dataInput').value)) {
            throw new Error('Por favor, insira uma data válida');
        }
        if (!validarHorario(document.getElementById('hora').value)) {
            throw new Error('Por favor, insira um horário válido');
        }

        // Criando FormData corretamente
        const formData = new FormData(formAgendamento);
        const token = localStorage.getItem('token');
        
        // Iniciando com logs para debug
        console.log('Operação:', idEditando ? 'Edição' : 'Criação');
        console.log('ID editando:', idEditando);
        
        let response;
        
        if (idEditando) {
            // Para edição, usar explicitamente método PUT
            console.log('Enviando PUT para:', `${API_BASE_URL}/api/agendamentos/${idEditando}`);
            
            response = await fetch(`${API_BASE_URL}/api/agendamentos/${idEditando}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
        } else {
            // Para criação, usar POST normalmente
            console.log('Enviando POST para:', `${API_BASE_URL}/api/agendamentos`);
            
            response = await fetch(`${API_BASE_URL}/api/agendamentos`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
        }

        if (!response.ok) {
            // Verificações específicas de erro
            if (response.status === 404 && idEditando) {
                throw new Error('Agendamento não encontrado. Pode ter sido excluído.');
            }
            
            const error = await response.json();
            throw new Error(error.message || 'Erro ao salvar agendamento');
        }

        const result = await response.json();
        mostrarNotificacao(
            idEditando ? 'Agendamento atualizado com sucesso!' : 'Agendamento criado com sucesso!',
            'sucesso'
        );

        // Limpar formulário e recarregar lista
        cancelarEdicao();
        await carregarAgendamentos();

    } catch (err) {
        console.error('Erro ao salvar agendamento:', err);
        mostrarNotificacao(err.message || 'Erro ao salvar. Tente novamente.', 'erro');
    } finally {
        envioEmAndamento = false;
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

function removerImagem() {
    const inputFoto = document.getElementById('fotoPet');
    const preview = document.getElementById('previewImagem');
    const imgPreview = document.getElementById('imgPreview');
    
    inputFoto.value = '';
    imgPreview.src = '';
    preview.style.display = 'none';
    
    if (idEditando) {
        // Cria campo para indicar remoção da imagem
        let removeField = document.getElementById('fotoRemover');
        if (!removeField) {
            removeField = document.createElement('input');
            removeField.type = 'hidden';
            removeField.id = 'fotoRemover';
            removeField.name = 'remove_foto';
            formAgendamento.appendChild(removeField);
        }
        removeField.value = '1';
    }
}

function init() {
    carregarAgendamentos();

    // Remove todos os listeners existentes primeiro para evitar duplicação
    const formClone = formAgendamento.cloneNode(true);
    formAgendamento.parentNode.replaceChild(formClone, formAgendamento);
    formAgendamento = formClone;

    // Adiciona os listeners novamente
    formAgendamento.addEventListener('submit', function(e) {
        e.preventDefault();
        salvarAgendamento(e);
    });

    document.getElementById('btn-cancelar-edicao').addEventListener('click', cancelarEdicao);
}

init();
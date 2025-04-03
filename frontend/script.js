document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".formulario-agendamento");
    const tabela = document.querySelector(".tabela-agendamentos tbody");
    const botaoNovoAgendamento = document.querySelectorAll(".botao-primario");

    let agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
    let editandoId = null;

    function atualizarTabela() {
        tabela.innerHTML = "";
        agendamentos.forEach((agendamento, index) => {
            const linha = document.createElement("tr");
            linha.innerHTML = `
                <td>
                    <div class="agendamento-pet">
                        <img src="${agendamento.foto || 'https://via.placeholder.com/100'}" class="miniatura-pet">
                        <div>
                            <div class="nome-pet">${agendamento.nomePet}</div>
                            <div class="raca-pet">${agendamento.racaPet}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="data-agendamento">${agendamento.data}</div>
                </td>
                <td>
                    <div class="hora-agendamento">${agendamento.hora}</div>
                </td>
                <td>
                    <span class="status pendente">Pendente</span>
                </td>
                <td>
                    <button class="botao-acao editar" data-id="${index}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="botao-acao excluir" data-id="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tabela.appendChild(linha);
        });

        document.querySelectorAll(".editar").forEach(botao => {
            botao.addEventListener("click", editarAgendamento);
        });

        document.querySelectorAll(".excluir").forEach(botao => {
            botao.addEventListener("click", excluirAgendamento);
        });

        localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
    }

    function adicionarAgendamento(event) {
        event.preventDefault();

        const nomePet = document.querySelector("#nomePet").value;
        const racaPet = document.querySelector("#racaPet").value;
        const data = document.querySelector("#data").value;
        const hora = document.querySelector("#hora").value;
        const fotoInput = document.querySelector("#fotoPet");

        if (!nomePet || !racaPet || !data || !hora) {
            alert("Preencha todos os campos obrigatórios!");
            return;
        }

        let foto = "";
        if (fotoInput.files.length > 0) {
            const leitor = new FileReader();
            leitor.readAsDataURL(fotoInput.files[0]);
            leitor.onload = function (e) {
                foto = e.target.result;
                salvarAgendamento({ nomePet, racaPet, data, hora, foto });
            };
        } else {
            salvarAgendamento({ nomePet, racaPet, data, hora, foto });
        }
    }

    function salvarAgendamento(agendamento) {
        if (editandoId !== null) {
            agendamentos[editandoId] = agendamento;
            editandoId = null;
        } else {
            agendamentos.push(agendamento);
        }

        form.reset();
        atualizarTabela();
    }

    function editarAgendamento(event) {
        const id = event.target.closest("button").dataset.id;
        const agendamento = agendamentos[id];

        document.querySelector("#nomePet").value = agendamento.nomePet;
        document.querySelector("#racaPet").value = agendamento.racaPet;
        document.querySelector("#data").value = agendamento.data;
        document.querySelector("#hora").value = agendamento.hora;

        editandoId = id;
    }

    function excluirAgendamento(event) {
        const id = event.target.closest("button").dataset.id;
        agendamentos.splice(id, 1);
        atualizarTabela();
    }

    form.addEventListener("submit", adicionarAgendamento);
    atualizarTabela();
});

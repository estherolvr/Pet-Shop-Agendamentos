const conexao = require('../config/conec');

const criarTabelaAgendamentos = () => {
    const sql = `
        CREATE TABLE IF NOT EXISTS agendamentos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome_pet VARCHAR(100) NOT NULL,
            raca_pet VARCHAR(100),
            data DATE NOT NULL,
            horario TIME NOT NULL,
            servico VARCHAR(100) NOT NULL,
            observacoes TEXT,
            foto_pet VARCHAR(255),  -- Ajustado para 'foto_pet' no lugar de 'imagem'
            status VARCHAR(50) DEFAULT 'Pendente',
            usuario_id INT NOT NULL,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        )
    `;
    conexao.query(sql, (erro) => {
        if (erro) {
            console.error('Erro ao criar a tabela de agendamentos:', erro);
        } else {
            console.log('Tabela de agendamentos verificada/criada com sucesso!');
        }
    });
};

module.exports = { criarTabelaAgendamentos };

const db = require('../config/conec'); // Importante: Adicione esta linha

const criarAgendamento = (req, res) => {
    console.log('--- Dentro de criarAgendamento ---');
    console.log('Req.body:', req.body);
    console.log('Req.file:', req.file);
    const { nome_pet, raca_pet, data, horario, servico, observacoes, status = 'Pendente' } = req.body;

    // Verificação dos campos obrigatórios
    if (!nome_pet || !raca_pet || !data || !horario || !servico) {
        return res.status(400).json({
            mensagem: 'Nome do pet, raça, data, horário e serviço são obrigatórios'
        });
    }

    const foto_pet = req.file ? req.file.filename : null;
    const { usuario_id } = req.user;

    const dataFormatada = new Date(data);
    const horarioFormatado = `${horario}:00`;
    const criado_em = new Date();
    const sqlAgendamento = `
        INSERT INTO agendamentos
          (usuario_id, nome_pet, raca_pet, servico, data, horario, observacoes, status, criado_em, foto_pet)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        usuario_id,
        nome_pet,
        raca_pet,
        servico,  
        dataFormatada,
        horarioFormatado,
        observacoes,
        status,
        criado_em,
        foto_pet
    ];

    db.query(sqlAgendamento, values, (error, results) => {
        if (error) {
            console.error('Erro ao salvar agendamento:', error);
            return res.status(500).json({
                mensagem: 'Erro ao salvar agendamento',
                erro: error.message
            });
        }

        res.status(201).json({
            mensagem: 'Agendamento criado com sucesso!',
            agendamento: {
                id: results.insertId,
                usuario_id,
                nome_pet,
                raca_pet,
                servico,
                data: dataFormatada,
                horario: horarioFormatado,
                observacoes,
                status,
                criado_em,
                foto_pet
            }
        });
    });
};

const atualizarAgendamento = (req, res) => {
    console.log('--- Dentro de atualizarAgendamento ---');
    console.log('Req.params:', req.params);
    console.log('Req.body:', req.body);
    console.log('Req.file:', req.file);

    const { id } = req.params;
    const { nome_pet, raca_pet, data, horario, servico, observacoes, status } = req.body;
    const foto_atual = req.body.foto_atual; // Campo hidden com o nome da foto atual
    const remove_foto = req.body.remove_foto; // Campo para indicar se a foto deve ser removida
    const foto_pet = req.file ? req.file.filename : foto_atual;
    const { usuario_id } = req.user; // Garanta que 'req.user' esteja populado com as informações do usuário

    // Verificação dos campos obrigatórios para atualização (você pode ajustar conforme necessário)
    if (!nome_pet || !raca_pet || !data || !horario || !servico) {
        return res.status(400).json({
            mensagem: 'Nome do pet, raça, data, horário e serviço são obrigatórios para atualizar'
        });
    }

    const dataFormatada = new Date(data);
    const horarioFormatado = `${horario}:00`;
    const atualizado_em = new Date();

    let sqlAtualizar = `
        UPDATE agendamentos
        SET usuario_id = ?,
            nome_pet = ?,
            raca_pet = ?,
            servico = ?,
            data = ?,
            horario = ?,
            observacoes = ?,
            status = ?,
            atualizado_em = ?,
            foto_pet = ?
        WHERE id = ?
    `;

    const values = [
        usuario_id,
        nome_pet,
        raca_pet,
        servico,
        dataFormatada,
        horarioFormatado,
        observacoes,
        status,
        atualizado_em,
        foto_pet,
        id // ID do agendamento a ser atualizado
    ];

    db.query(sqlAtualizar, values, (error, results) => {
        if (error) {
            console.error('Erro ao atualizar agendamento:', error);
            return res.status(500).json({
                mensagem: 'Erro ao atualizar o agendamento',
                erro: error.message
            });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Agendamento não encontrado' });
        }

        // Lógica para remover a foto antiga se solicitado e uma nova foto foi enviada
        if (remove_foto === '1' && req.file && foto_atual) {
            const path = require('path');
            const fs = require('fs');
            const fotoAntigaPath = path.join(__dirname, '../uploads', foto_atual); 

            fs.unlink(fotoAntigaPath, (err) => {
                if (err) {
                    console.error('Erro ao remover foto antiga:', err);
       
                } else {
                    console.log('Foto antiga removida com sucesso:', foto_atual);
                }
            });
        }

        res.json({ mensagem: 'Agendamento atualizado com sucesso!', agendamento: { id, ...req.body, foto_pet } });
    });
};

module.exports = { criarAgendamento, atualizarAgendamento };
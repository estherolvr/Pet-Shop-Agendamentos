module.exports = function validarAgendamento(req, res, next) {
    const { data, horario } = req.body;
    const dataAtual = new Date();
    const dataAgendada = new Date(data);
    const limiteFinal = new Date('2025-12-31');

    // Feriados fixos (poderia ser movido para um banco de dados)
    const feriados = {
        '12-24': 'Véspera de Natal',
        '12-25': 'Natal',
        '12-31': 'Véspera de Ano Novo',
        '01-01': 'Ano Novo'
    };

    // Validação básica da data
    if (isNaN(dataAgendada.getTime())) {
        return res.status(400).json({ mensagem: 'Data inválida.' });
    }

    // Verificar se é feriado
    const mesDia = (dataAgendada.getMonth() + 1).toString().padStart(2, '0') + '-' + 
                   dataAgendada.getDate().toString().padStart(2, '0');
    
    if (feriados[mesDia]) {
        return res.status(400).json({ 
            mensagem: `Não atendemos no feriado de ${feriados[mesDia]}. Por favor, escolha outra data.`
        });
    }

    // Verificar se a data é no passado (considerando apenas a data, não o horário)
    const dataAtualSemHora = new Date(dataAtual.setHours(0, 0, 0, 0));
    if (dataAgendada < dataAtualSemHora) {
        return res.status(400).json({ mensagem: 'Não é possível agendar para datas passadas.' });
    }

    // Verificar se está dentro do limite (dez/2025)
    if (dataAgendada > limiteFinal) {
        return res.status(400).json({ mensagem: 'Não aceitamos agendamentos após dezembro de 2025.' });
    }

    // Validação do horário
    if (!horario || !/^([0-9]{2}):([0-9]{2})$/.test(horario)) {
        return res.status(400).json({ mensagem: 'Horário inválido. Use o formato HH:MM.' });
    }

    const [hora, minuto] = horario.split(':').map(Number);
    
    // Horário comercial (9h às 17h)
    if (hora < 9 || hora > 17 || (hora === 17 && minuto > 0)) {
        return res.status(400).json({ 
            mensagem: 'Atendimento apenas das 09:00 às 17:00. Escolha um horário dentro deste intervalo.' 
        });
    }

    // Validar minutos
    if (minuto < 0 || minuto >= 60 || (minuto % 15 !== 0)) {
        return res.status(400).json({ 
            mensagem: 'Os agendamentos devem ser feitos em intervalos de 15 minutos (00, 15, 30, 45).' 
        });
    }

    // Verificar se não é domingo
    if (dataAgendada.getDay() === 0) {
        return res.status(400).json({ mensagem: 'Não atendemos aos domingos.' });
    }

    next();
};
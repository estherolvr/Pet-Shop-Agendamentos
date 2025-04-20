const criarAgendamento = (req, res) => {
    upload.single('foto_pet')(req, res, (err) => {
      if (err) {
        return res.status(500).json({ mensagem: 'Erro no upload da foto', erro: err.message });
      }
  
      const { nome_pet, raca_pet, data, horario, servico, observacoes, status = 'Pendente' } = req.body;
      const foto_pet = req.file ? req.file.filename : null;
      const { usuario_id } = req.user;
  
      const dataFormatada = new Date(data);
      const horarioFormatado = `${horario}:00`;
      const criado_em = new Date();
  
      // 1. Inserir o PET
      const sqlPet = 'INSERT INTO pets (nome, raca, imagem, usuario_id) VALUES (?, ?, ?, ?)';
      db.query(sqlPet, [nome_pet, raca_pet, foto_pet, usuario_id], (errPet, resultadoPet) => {
        if (errPet) {
          console.error('Erro ao salvar pet:', errPet);
          return res.status(500).json({ mensagem: 'Erro ao salvar pet', erro: errPet.message });
        }
  
        const pet_id = resultadoPet.insertId;
  
        // 2. Inserir o AGENDAMENTO
        const sqlAgendamento = `
          INSERT INTO agendamentos (pet_id, data, horario, observacoes, status, criado_em, usuario_id, foto_pet)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
  
        const values = [pet_id, dataFormatada, horarioFormatado, observacoes, status, criado_em, usuario_id, foto_pet];
  
        db.query(sqlAgendamento, values, (error, results) => {
          if (error) {
            console.error('Erro ao salvar agendamento:', error);
            return res.status(500).json({ mensagem: 'Erro ao salvar agendamento', erro: error.message });
          }
  
          res.status(201).json({
            mensagem: 'Agendamento criado com sucesso!',
            agendamento: {
              id: results.insertId,
              pet_id,
              data: dataFormatada,
              horario: horarioFormatado,
              observacoes,
              status,
              criado_em,
              usuario_id,
              foto_pet
            }
          });
        });
      });
    });
  };
  
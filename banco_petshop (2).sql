-- Criar o banco de dados
CREATE DATABASE banco_petshop;
USE banco_petshop;

-- Tabela de Usuários
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Pets
CREATE TABLE pets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    raca VARCHAR(100),
    imagem VARCHAR(255),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
CREATE TABLE agendamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL, 
    nome_pet VARCHAR(100),   
    raca_pet VARCHAR(100),    
    servico VARCHAR(100),
    observacoes TEXT,
    foto_pet VARCHAR(255),
    status ENUM('Pendente', 'Confirmado', 'Cancelado') DEFAULT 'Pendente',
    data DATE NOT NULL,
    horario TIME NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

SELECT * FROM usuarios;
SELECT * FROM agendamentos;
SHOW CREATE TABLE agendamentos;

ALTER TABLE agendamentos
ADD COLUMN pet_id INT NOT NULL,
ADD CONSTRAINT fk_pet_id FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE;

ALTER TABLE agendamentos MODIFY pet_id INT NULL;
ALTER TABLE agendamentos
ADD CONSTRAINT unique_agendamento UNIQUE (pet_id, data, horario);










CREATE DATABASE IF NOT EXISTS mala_pronta CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE mala_pronta;

CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(120) NOT NULL UNIQUE,
    senha VARCHAR(60) NOT NULL
);

CREATE TABLE IF NOT EXISTS itens (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(80) NOT NULL,
    separado BOOLEAN NOT NULL DEFAULT FALSE,
    usuario_id BIGINT NOT NULL,
    CONSTRAINT fk_itens_usuarios FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
);

-- Conta de demonstração. Senha de teste: Mala1234!
INSERT INTO usuarios (email, senha)
SELECT 'viajante@exemplo.com', '$2a$10$AywIZzIrbl7bLM/RKLcRw.Lh1qodkQxaVQDyMba.r20..M8G0zbzy'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'viajante@exemplo.com');

# Mala Pronta

O Mala Pronta é um aplicativo para organizar o que levar em uma viagem. A ideia é evitar esquecer itens na hora de arrumar a mala. Depois de entrar, você pode cadastrar, consultar, editar e excluir seus itens. Conforme for arrumando a mala, marque o que já foi separado.

As cinco telas do app são Login, A separar, Separados, Detalhes e Formulário. O frontend foi feito com React Native, Expo e TypeScript. Ele se comunica com uma API REST em Java com Spring Boot. O login usa JWT, os itens ficam no MySQL e o AsyncStorage guarda o último e-mail usado.

## Como rodar no Windows

Você precisa de Java 17 ou superior, Node.js 22 com npm e MySQL 8 em execução.

### 1. Configurar o banco

No MySQL Workbench, entre com uma conta administradora e execute o arquivo `database/schema.sql`. Ele cria o banco `mala_pronta`, as tabelas e a conta de demonstração.

Em seguida, crie a conta que o backend usa para acessar o banco. Substitua `SUA_SENHA` por uma senha de sua escolha.

```sql
CREATE USER IF NOT EXISTS 'mala_app'@'localhost' IDENTIFIED BY 'SUA_SENHA';
GRANT SELECT ON mala_pronta.usuarios TO 'mala_app'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON mala_pronta.itens TO 'mala_app'@'localhost';
```

### 2. Iniciar o aplicativo

Abra a pasta do projeto no VS Code. No terminal PowerShell da raiz, informe a mesma senha usada no MySQL e execute o inicializador.

```powershell
$env:SPRING_DATASOURCE_PASSWORD = 'SUA_SENHA'
.\iniciar.bat
```

O arquivo inicia os dois serviços no mesmo terminal. O backend usa a porta `8080` e o Expo usa a `8081`.

- **Navegador.** Pressione `w` no terminal do Expo.
- **Emulador Android.** Com o emulador aberto, pressione `a` no terminal do Expo.
- **Celular.** Antes de iniciar, copie `frontend/.env.example` para `frontend/.env` e troque o IP de exemplo pelo IP do computador. Conecte o celular à mesma rede Wi-Fi e leia o QR code com o Expo Go compatível com o SDK 54.

### 3. Testar

Entre com o e-mail `viajante@exemplo.com` e a senha `Mala1234!`. Cadastre um item, como Carregador, marque como separado e confira se ele mudou de lista. Abra os detalhes para editar ou excluir o item.

## Integrantes

| Nome completo | RM |
| --- | --- |
| Lucas Mateus | 1143184195 |
| Pedro Gabriel de Oliveira Pinheiro | 1143187841 |
| Miguel Conceição Nunes | 1143182261 |

# Servidor Firebase Admin - Certifica

Este diretório contém um servidor mínimo (Express) que inicializa o Firebase Admin SDK
usando um arquivo de service account. Use-o para operações administrativas (listar usuários,
consultas seguras, etc.) sem expor as chaves no frontend.

Passos para usar localmente:

1. Mover/copi ar seu arquivo de service account para `server/` ou fornecer o caminho via variável:

   - Copiar o arquivo `sigaf-certifica-agrifamiliar-firebase-adminsdk-...json` para `server/`
   - Ou editar `.env` e setar `SERVICE_ACCOUNT_PATH` apontando para o arquivo

2. Criar `.env` a partir do exemplo:

   cp .env.example .env
   # e editar .env para confirmar SERVICE_ACCOUNT_PATH

3. Instalar dependências:

   cd server
   npm install

4. Iniciar o servidor:

   npm start

5. Testar endpoints:

   - GET http://localhost:4000/api/ping
   - GET http://localhost:4000/api/project-info
   - GET http://localhost:4000/api/users

Segurança:
- NÃO commit o arquivo de service account. Ele permite controle total sobre seu projeto Firebase.
- Use regras de segurança e contas separadas para produção.

# Certifica AgriFamiliar ESG

Resumo rápido — repositório com frontend React + Vite e um pequeno servidor Express (Firebase Admin).

## O que tem aqui
- `src/` — frontend React + Tailwind + Vite
- `server/` — servidor Express que inicializa Firebase Admin (usando service account)
- `.github/workflows/deploy-pages.yml` — workflow para build e deploy do frontend para GitHub Pages

---

## Rodando localmente (frontend)
1. Instale dependências do frontend (na raiz):
```powershell
cd C:\CERTIFICA_FINAL
npm install
```
2. Se você tiver Firebase Web config e quiser que o frontend use Firebase (opcional), crie um `.env` na raiz com as variáveis Vite:
```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:123456:web:abcdef

# URL do backend (server) em desenvolvimento — se estiver rodando localmente:
VITE_API_URL=http://localhost:4000
```
3. Inicie o dev server:
```powershell
npm run dev
```
4. Abra `http://localhost:5174/` (ou porta indicada pelo Vite)

---

## Rodando o servidor (Firebase Admin)
> ATENÇÃO: nunca commite seu arquivo de service account para repositório público.

1. Copie seu arquivo de service account (`sigaf-certifica-agrifamiliar-firebase-adminsdk-*.json`) para a pasta `server/` (ou mantenha onde preferir).
2. No diretório `server/`, crie `.env` com base em `.env.example` e atualize `SERVICE_ACCOUNT_PATH` se necessário.
3. Instale e inicie:
```powershell
cd C:\CERTIFICA_FINAL\server
npm install
npm start
```
4. Teste endpoints:
- `GET http://localhost:4000/api/ping`
- `GET http://localhost:4000/api/project-info`
- `GET http://localhost:4000/api/users` (requer permissões no Admin SDK)

---

## Deploy do frontend (GitHub Pages)
O workflow `.github/workflows/deploy-pages.yml` está configurado para rodar no push para `main` e publicar `dist/` no GitHub Pages.

Passos:
1. Crie o repositório no GitHub e adicione o remote:
```powershell
cd C:\CERTIFICA_FINAL
git remote add origin https://github.com/SEU_USUARIO/Certifica-AgriFamiliar-ESG.git
git branch -M main
git push -u origin main
```
2. Após o push, verifique em **Actions** no GitHub se o workflow terminou com sucesso. A página será publicada automaticamente.

---

## Como alternar entre mock e backend
- Se `VITE_API_URL` estiver definido (ex.: `http://localhost:4000`), o frontend fará chamadas para `VITE_API_URL + <rota>`.
- Se não estiver definido, o frontend usa um `apiFetch` mock que retorna dados de exemplo.

---

## Segurança
- `server/.env.example` existe como exemplo. Não commite `.env` nem a chave do service account.
- `.gitignore` já ignora o arquivo `sigaf-certifica-agrifamiliar-firebase-adminsdk-*.json`.

---

Se quiser, eu posso:
- A) Atualizar o `apiFetch` para mapear rotas específicas do backend (faço aqui)
- B) Fazer o primeiro push para o GitHub (você me autoriza a executar comandos git aqui?)
- C) Ajudar a remover o service account do histórico git (se já tiver sido commitado)

Diga qual opção prefere e eu continuo.
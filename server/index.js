// server/index.js
// Servidor mínimo para expor endpoints que usam Firebase Admin SDK.
// ATENÇÃO: mantenha o arquivo de service account fora do repositório público.

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH || './sigaf-certifica-agrifamiliar-firebase-adminsdk-fbsvc-5fc91f89fd.json';

let admin;
try {
  admin = require('firebase-admin');
} catch (e) {
  console.error('firebase-admin não encontrado. Rode `npm install` no diretório server.');
  process.exit(1);
}

let firestore;
let auth;

try {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  firestore = admin.firestore();
  auth = admin.auth();
  console.log('Firebase Admin inicializado com sucesso.');
} catch (err) {
  console.error('Falha ao inicializar Firebase Admin. Verifique o caminho de SERVICE_ACCOUNT_PATH e o conteúdo do arquivo.');
  console.error(err);
  process.exit(1);
}

app.get('/api/ping', (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || 'development' });
});

// Rota de exemplo que retorna o projectId do service account
app.get('/api/project-info', (req, res) => {
  try {
    const cert = admin.app().options.credential ? undefined : undefined; // placeholder
    // melhor maneira: ler do arquivo de service account
    const serviceAccount = require(serviceAccountPath);
    res.json({ projectId: serviceAccount.project_id || null });
  } catch (err) {
    res.status(500).json({ error: 'Não foi possível ler o service account' });
  }
});

// Exemplo simples: listar os primeiros 10 usuários (se houver permissões)
app.get('/api/users', async (req, res) => {
  try {
    const list = await auth.listUsers(10);
    res.json({ users: list.users.map(u => ({ uid: u.uid, email: u.email })) });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`);
});

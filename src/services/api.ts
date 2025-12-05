// src/services/api.ts
import { getAuth, signInWithCustomToken, signInAnonymously } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Declarações globais do Canvas
declare const __firebase_config: string | undefined;
declare const __app_id: string | undefined;
declare const __initial_auth_token: string | undefined;

// Configuração do Firebase
// Primeiro tentamos ler uma configuração injetada (__firebase_config),
// se não existir usamos as variáveis de ambiente do Vite (import.meta.env)
const configFromGlobal = typeof __firebase_config !== "undefined" && __firebase_config
  ? JSON.parse(__firebase_config)
  : undefined;

const configFromEnv = (typeof import.meta !== 'undefined' && (import.meta as any).env)
  ? {
      apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY,
      authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: (import.meta as any).env.VITE_FIREBASE_APP_ID,
    }
  : undefined;

const firebaseConfig = configFromGlobal || configFromEnv || {};

let app: any = undefined;
let db: any = undefined;
let auth: any = undefined;

if (firebaseConfig && (firebaseConfig.projectId || firebaseConfig.apiKey)) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    console.log("Firebase inicializado com sucesso.");
  } catch (err) {
    console.warn("Falha ao inicializar Firebase, continuando em modo mock:", err);
    app = undefined;
    db = undefined;
    auth = undefined;
  }
} else {
  console.warn(
    "Firebase não inicializado: nenhuma configuração encontrada. Para ativar o Firebase adicione as variáveis de ambiente VITE_FIREBASE_* ou injete __firebase_config."
  );
}

export { db, auth };

// Inicialização da autenticação
export const initializeAuth = async () => {
  try {
    if (!auth) {
      console.warn("initializeAuth: auth não inicializado. Pulando inicialização de autenticação.");
      return;
    }

    if (typeof __initial_auth_token !== "undefined" && __initial_auth_token) {
      await signInWithCustomToken(auth, __initial_auth_token);
      console.log("Autenticação com token customizado bem-sucedida.");
    } else {
      await signInAnonymously(auth);
      console.log("Login anônimo bem-sucedido.");
    }
  } catch (error) {
    console.error("Erro na inicialização da autenticação:", error);
  }
};

// Tipo do retorno da API
export type ApiResponse<T = any> = {
  status: number;
  ok: boolean;
  json: () => Promise<T>;
};

// Função mock de API
export const apiFetch = async (url: string, _options?: RequestInit): Promise<ApiResponse> => {
  // Se a variável de ambiente Vite `VITE_API_URL` estiver definida, encaminhamos para o servidor real
  const apiBase = (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_API_URL)
    ? (import.meta as any).env.VITE_API_URL
    : "";

  if (apiBase) {
    const full = `${apiBase}${url}`;
    const res = await fetch(full, _options);
    return {
      status: res.status,
      ok: res.ok,
      json: async () => await res.json(),
    };
  }

  console.log(`[API MOCK] Chamada para: ${url}`);
  return {
    status: 200,
    ok: true,
    json: async () => ({
      success: true,
      message: "Resposta simulada da API.",
      token: "mock-token-123",
      user: {
        id: 1,
        nome: "Usuário Mock",
        email: "mock@example.com",
        role: "admin",
      },
    }),
  };
};

import { getAuth, signInWithCustomToken, signInAnonymously } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

declare const __firebase_config: string | undefined;
declare const __app_id: string | undefined;
declare const __initial_auth_token: string | undefined;

const firebaseConfig =
  typeof __firebase_config !== "undefined" ? JSON.parse(__firebase_config) : {};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const initializeAuth = async () => {
  try {
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

export const apiFetch = async (url: string, options?: RequestInit) => {
  console.log(`[API MOCK] Chamada para: ${url}`);

  return {
    status: 200,
    ok: true,
    json: async () => ({
      success: true,
      message: "Resposta simulada da API.",
    }),
  };
};

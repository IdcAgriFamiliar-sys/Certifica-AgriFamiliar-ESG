import { getAuth, signInWithCustomToken, signInAnonymously } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Variáveis globais fornecidas pelo ambiente Canvas
// Garantindo que elas existam para o TypeScript
declare const __firebase_config: string | undefined;
declare const __app_id: string | undefined;
declare const __initial_auth_token: string | undefined;

// --- Configuração e Inicialização do Firebase ---
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Função para lidar com a autenticação inicial
export const initializeAuth = async () => {
    try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
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

// --- Função Mock de API (Substitua pela sua lógica de backend real, se tiver) ---
export const apiFetch = async (url: string, options?: RequestInit) => {
    // Esta é a função que o restante do seu app usa para fazer chamadas de rede.
    // Ela deve retornar algo que se pareça com a resposta de um "fetch" normal.
    console.log(`[API MOCK] Chamada para: ${url}`);
    
    // Retorna um objeto que simula uma resposta de sucesso para permitir a compilação.
    return {
        status: 200,
        ok: true,
        json: async () => ({ success: true, message: "Resposta simulada da API." }),
    };
};

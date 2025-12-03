// src/services/api.ts
// Serviço de comunicação com a API do Certifica AgriFamiliar ESG
// Corrigido para funcionar no Vite + TypeScript

// Variável de ambiente no Vite deve começar com VITE_
// Exemplo no .env: VITE_API_BASE_URL=https://meuapi.com
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

/**
 * Função para realizar requisições GET
 * @param endpoint - caminho da API, ex: "farmers"
 */
export async function getData(endpoint: string): Promise<any> {
  const url = `${API_BASE_URL}/${endpoint}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Erro ao buscar dados: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Função para realizar requisições POST
 * @param endpoint - caminho da API, ex: "farmers"
 * @param data - objeto a ser enviado no corpo da requisição
 */
export async function postData(endpoint: string, data: any): Promise<any> {
  const url = `${API_BASE_URL}/${endpoint}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Erro ao enviar dados: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Função para realizar requisições DELETE
 * @param endpoint - caminho da API, ex: "farmers/1"
 */
export async function deleteData(endpoint: string): Promise<void> {
  const url = `${API_BASE_URL}/${endpoint}`;
  const response = await fetch(url, { method: "DELETE" });

  if (!response.ok) {
    throw new Error(`Erro ao deletar dados: ${response.statusText}`);
  }
}

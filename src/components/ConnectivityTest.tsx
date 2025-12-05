import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../services/firebase';
import { signInAnonymously } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadString } from 'firebase/storage';

const ConnectivityTest: React.FC = () => {
    const [logs, setLogs] = useState<string[]>([]);
    const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');

    const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);

    const runTest = async () => {
        setLogs([]);
        setStatus('running');
        addLog("Iniciando diagnóstico avançado...");

        try {
            // 2. REST API Check (Database Existence)
            addLog("Verificando existência do banco de dados via REST...");
            try {
                // Check root documents to see if DB exists
                const response = await fetch("https://firestore.googleapis.com/v1/projects/sigaf-certifica-agrifamiliar/databases/(default)/documents");
                addLog(`Status da API REST (Root): ${response.status} ${response.statusText}`);
                
                if (response.status === 404) {
                    const text = await response.text();
                    if (text.includes("default") && text.includes("not found")) {
                        throw new Error("BANCO DE DADOS NÃO ENCONTRADO. Crie o Firestore Database no console.");
                    }
                }
                
                if (!response.ok && response.status !== 200) {
                     addLog(`AVISO: Resposta não-200 da API: ${response.status}`);
                } else {
                    addLog("API REST respondeu OK (Banco existe).");
                }

            } catch (e: any) {
                addLog(`ERRO CRÍTICO: ${e.message}`);
                throw e; // Stop test if DB doesn't exist
            }

            // 3. Auth
            addLog("Tentando autenticação...");
            if (!auth.currentUser) {
                await signInAnonymously(auth);
            }
            addLog(`Autenticado: ${auth.currentUser?.uid}`);

            // 4. Firestore SDK
            addLog("Tentando escrever via SDK...");
            // Timeout for SDK
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Timeout no SDK do Firestore")), 10000)
            );

            await Promise.race([
                addDoc(collection(db, "connectivity_logs"), {
                    timestamp: serverTimestamp(),
                    type: "sdk_test"
                }),
                timeoutPromise
            ]);
            addLog("Escrita via SDK: SUCESSO");

            // 5. Storage
            addLog("Tentando upload Storage...");
            const storageRef = ref(storage, `connectivity_test/${Date.now()}.txt`);
            await uploadString(storageRef, "Teste");
            addLog("Upload Storage: SUCESSO");

            setStatus('success');
            addLog("DIAGNÓSTICO COMPLETO: SUCESSO");

        } catch (error: any) {
            console.error("Erro no teste:", error);
            addLog(`FALHA: ${error.message}`);
            setStatus('error');
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Diagnóstico de Conectividade Firebase</h1>

            <div className="mb-6">
                <button
                    onClick={runTest}
                    disabled={status === 'running'}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {status === 'running' ? 'Rodando...' : 'Iniciar Teste'}
                </button>
            </div>

            <div className="bg-gray-100 p-4 rounded border border-gray-300 font-mono text-sm h-96 overflow-y-auto">
                {logs.length === 0 ? <p className="text-gray-500">Clique em Iniciar Teste para ver os logs...</p> : logs.map((log, i) => (
                    <div key={i} className="mb-1 border-b border-gray-200 pb-1 last:border-0">{log}</div>
                ))}
            </div>
        </div>
    );
};

export default ConnectivityTest;

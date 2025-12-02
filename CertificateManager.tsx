import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, collection, query, onSnapshot, addDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';

// --- Variáveis Globais (Fornecidas pelo Ambiente Canvas) ---
// O appId, config do Firebase, e o token de autenticação são injetados pelo ambiente.
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// --- Tipos ---
interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: Timestamp;
}

const CertificateManager = () => {
  const [db, setDb] = useState<any>(null);
  const [auth, setAuth] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCert, setNewCert] = useState({ title: '', issuer: '', date: '' });
  const [error, setError] = useState<string | null>(null);

  // 1. Inicialização do Firebase e Autenticação
  useEffect(() => {
    if (!firebaseConfig) {
      setError("Configuração do Firebase não encontrada. O aplicativo não pode ser inicializado.");
      setLoading(false);
      return;
    }

    try {
      const app = initializeApp(firebaseConfig);
      const firestore = getFirestore(app);
      const firebaseAuth = getAuth(app);

      setDb(firestore);
      setAuth(firebaseAuth);

      // Autenticar ou usar o token fornecido
      const authenticate = async (authInstance: any) => {
        try {
          if (initialAuthToken) {
            await signInWithCustomToken(authInstance, initialAuthToken);
          } else {
            await signInAnonymously(authInstance);
          }
        } catch (e: any) {
          console.error("Erro na autenticação:", e);
          setError(`Erro ao autenticar: ${e.message}`);
        }
      };

      // Listener para o estado de autenticação
      const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
        } else {
          // Tenta autenticar se não houver usuário logado
          authenticate(firebaseAuth);
        }
        setLoading(false);
      });

      // Limpar o listener na desmontagem
      return () => unsubscribe();
    } catch (e: any) {
      console.error("Erro ao inicializar Firebase:", e);
      setError(`Erro fatal de inicialização: ${e.message}`);
      setLoading(false);
    }
  }, []);

  // 2. Listener de Dados do Firestore
  useEffect(() => {
    if (!db || !user) {
      // Não busca dados se o Firebase não estiver pronto ou o usuário não estiver autenticado
      return;
    }

    // Estrutura de coleção privada: /artifacts/{appId}/users/{userId}/certificates
    const certificatesCollectionPath = `/artifacts/${appId}/users/${user.uid}/certificates`;
    const q = query(collection(db, certificatesCollectionPath));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedCerts: Certificate[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        fetchedCerts.push({
          id: doc.id,
          title: data.title || 'Sem Título',
          issuer: data.issuer || 'Desconhecido',
          date: data.date || Timestamp.now(),
        });
      });

      // Ordena por data mais recente primeiro
      fetchedCerts.sort((a, b) => b.date.toDate().getTime() - a.date.toDate().getTime());
      setCertificates(fetchedCerts);
    }, (e) => {
      console.error("Erro ao ouvir dados do Firestore:", e);
      setError("Não foi possível carregar os certificados. Verifique as regras de segurança.");
    });

    return () => unsubscribe(); // Limpar o listener
  }, [db, user]); // Depende do DB e do Usuário estarem prontos

  // Adicionar um novo certificado
  const handleAddCertificate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !user) {
      setError("Usuário não autenticado ou DB indisponível.");
      return;
    }
    if (!newCert.title || !newCert.issuer || !newCert.date) {
      setError("Todos os campos do certificado são obrigatórios.");
      return;
    }

    try {
      const certDate = new Date(newCert.date);
      if (isNaN(certDate.getTime())) {
        setError("Data inválida. Use o formato AAAA-MM-DD.");
        return;
      }

      const certData = {
        title: newCert.title.trim(),
        issuer: newCert.issuer.trim(),
        date: Timestamp.fromDate(certDate),
      };

      const certificatesCollectionPath = `/artifacts/${appId}/users/${user.uid}/certificates`;
      await addDoc(collection(db, certificatesCollectionPath), certData);

      setNewCert({ title: '', issuer: '', date: '' });
      setError(null);
    } catch (e: any) {
      console.error("Erro ao adicionar certificado:", e);
      setError(`Erro ao salvar: ${e.message}`);
    }
  }, [db, user, newCert]);

  // Excluir um certificado
  const handleDeleteCertificate = useCallback(async (id: string) => {
    if (!db || !user) {
      setError("Usuário não autenticado ou DB indisponível.");
      return;
    }
    
    // Usar modal customizado ao invés de window.confirm()
    // Como não podemos usar window.confirm, assumimos que o clique é uma intenção de exclusão
    // Em um app real, aqui haveria um modal de confirmação.

    try {
      const certificatesCollectionPath = `/artifacts/${appId}/users/${user.uid}/certificates`;
      const docRef = doc(db, certificatesCollectionPath, id);
      await deleteDoc(docRef);
      setError(null);
    } catch (e: any) {
      console.error("Erro ao excluir certificado:", e);
      setError(`Erro ao excluir: ${e.message}`);
    }
  }, [db, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCert(prev => ({ ...prev, [name]: value }));
  };

  // Função utilitária para formatar a data
  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp || typeof timestamp.toDate !== 'function') return 'Data Inválida';
    return timestamp.toDate().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl font-semibold text-gray-700">A carregar e autenticar...</div>
      </div>
    );
  }

  // Componente de Cartão de Certificado
  const CertificateCard: React.FC<{ cert: Certificate }> = ({ cert }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-indigo-500 flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-1">{cert.title}</h3>
        <p className="text-sm text-indigo-600 font-medium mb-3">{cert.issuer}</p>
        <p className="text-xs text-gray-500">Concluído em: {formatDate(cert.date)}</p>
      </div>
      <button
        onClick={() => handleDeleteCertificate(cert.id)}
        className="mt-4 self-end text-xs text-red-500 hover:text-red-700 font-medium transition-colors duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Excluir
      </button>
    </div>
  );


  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          Gerenciador de Certificados
        </h1>
        <p className="text-gray-600 mb-6">
          Armazene e organize seus certificados de forma privada usando Firestore.
        </p>
        
        {/* Informação do Usuário */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 text-sm text-gray-700 border-l-4 border-green-500">
          <p className="font-semibold">ID do Usuário (UID):</p>
          <p className="break-all text-xs sm:text-sm">{user?.uid || 'Aguardando UID...'}</p>
        </div>

        {/* Formulário de Adição */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Adicionar Novo Certificado</h2>
          {error && (
            <div role="alert" className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <form onSubmit={handleAddCertificate} className="space-y-4">
            <input
              type="text"
              name="title"
              placeholder="Nome do Certificado (Ex: Curso React Intermediário)"
              value={newCert.title}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="text"
              name="issuer"
              placeholder="Emissor (Ex: Google, Alura, Coursera)"
              value={newCert.issuer}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="date"
              name="date"
              placeholder="Data de Conclusão"
              value={newCert.date}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!user}
              className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
            >
              {user ? 'Salvar Certificado' : 'Aguardando Conexão...'}
            </button>
          </form>
        </div>

        {/* Lista de Certificados */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Meus Certificados ({certificates.length})</h2>
        {certificates.length === 0 ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
            <p className="text-yellow-700">Você ainda não adicionou nenhum certificado. Use o formulário acima para começar!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map(cert => (
              <CertificateCard key={cert.id} cert={cert} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateManager;

// No ambiente Canvas, é necessário exportar o componente principal como padrão.
// O nome do arquivo e do componente principal é flexível, mas o export default é App no nosso contexto
// Usaremos CertificateManager como App para fins de clareza na resposta.
const App = CertificateManager;

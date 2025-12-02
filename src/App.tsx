import React, { useState } from 'react';
// Importa o componente da Landing Page
import LandingPage from './components/LandingPage';
// Importa o componente Dashboard
import Dashboard from './components/Dashboard';

// Define os estados possíveis da aplicação
type AppView = 'landing' | 'dashboard';

const App: React.FC = () => {
  // Estado para controlar a visualização atual: Tela inicial ou Painel
  const [activeView, setActiveView] = useState<AppView>('landing');

  // Funções de controle de autenticação
  const handleLogin = () => {
    // Simula uma autenticação bem-sucedida
    setActiveView('dashboard');
  };

  const handleLogout = () => {
    // Retorna para a tela de boas-vindas
    if (window.confirm('Tem certeza que deseja sair do Painel de Gestão?')) {
      setActiveView('landing');
    }
  };

  return (
    <div className="App">
      {activeView === 'landing' ? (
        // Renderiza a Landing Page, passando a função de login
        <LandingPage onLogin={handleLogin} />
      ) : (
        // Renderiza o Dashboard, passando a função de logout
        <Dashboard onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;

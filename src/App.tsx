import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

// Tipos de perfil que o sistema pode assumir
// Adicionamos 'coordinator' para segregar permissões
export type UserRole = 'admin' | 'coordinator' | 'auditor' | 'farmer';
type AppView = 'landing' | 'dashboard';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>('landing');
  // NOVO ESTADO: O perfil atualmente logado ou visualizado. 
  // O padrão é 'admin' para simular o acesso ao painel de gestão.
  const [userRole, setUserRole] = useState<UserRole>('admin'); 

  // A função de login agora simula a entrada de um perfil
  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setActiveView('dashboard');
  };

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair do Painel de Gestão?')) {
      setActiveView('landing');
      setUserRole('admin'); // Resetar a simulação para o padrão
    }
  };

  return (
    <div className="App">
      {activeView === 'landing' ? (
        // Passa a função de login que aceita o perfil (role)
        <LandingPage onLogin={handleLogin} />
      ) : (
        // Passa o perfil, a função de logout e a função de mudar perfil
        <Dashboard 
          userRole={userRole} 
          onLogout={handleLogout} 
          setUserRole={setUserRole} 
        />
      )}
    </div>
  );
};

export default App;

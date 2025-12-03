import React from 'react';
import Cabecalho from './Cabecalho';
import Sidebar from './Sidebar';

import CertificationsView from './Painel/CertificationsView';
import FarmersView from './Painel/FarmersView';
import AuditorsView from './Painel/AuditorsView';

import './Dashboard.css'; // Se você tiver CSS externo

interface DashboardProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ currentView, setCurrentView }) => {
  const renderView = () => {
    switch (currentView) {
      case 'farmers':
        return <FarmersView />;
      case 'auditors':
        return <AuditorsView />;
      case 'certifications':
        return <CertificationsView />;
      default:
        return <FarmersView />;
    }
  };

  return (
    <div className="dashboard-container">
      <Cabecalho />

      <div className="dashboard-content">
        <Sidebar setCurrentView={setCurrentView} />

        <main className="dashboard-main">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

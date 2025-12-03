import React from 'react';
import { BarChart3, FileText, Download } from 'lucide-react';

const ReportCard: React.FC<{ icon: React.ReactNode; title: string; description: string; color: string; }> = ({ icon, title, description, color }) => (
  <div className="bg-white p-4 rounded shadow border-l-4" style={{ borderColor: color }}>
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 rounded-full" style={{ backgroundColor: color, color: '#fff' }}>{icon}</div>
      <h4 className="font-semibold">{title}</h4>
    </div>
    <p className="text-sm text-gray-600 mb-4">{description}</p>
    <button className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-white rounded"><Download size={14} /> Baixar</button>
  </div>
);

const ReportsView: React.FC = () => {
  const reports = [
    { icon: <FileText size={18} />, title: 'Desempenho ESG', description: 'Indicadores E, S e G por região.', color: 'rgb(59,130,246)' },
    { icon: <BarChart3 size={18} />, title: 'Produtividade', description: 'Volumes por safra e produtividade média.', color: 'rgb(16,185,129)' },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold flex items-center gap-3"><BarChart3 size={28} className="text-red-600" /> Relatórios</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((r, i) => <ReportCard key={i} {...r} />)}
      </div>
    </div>
  );
};

export default ReportsView;

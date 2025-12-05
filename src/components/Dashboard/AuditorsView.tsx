import React, { useState, useEffect } from 'react';
import { Shield, UserPlus, Search, ChevronRight, CheckCircle, XCircle, FileText, GraduationCap } from 'lucide-react';
// import { Auditor } from '../../types';
import Button from '../Button';
import { db } from '../../services/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Aprovado': return 'bg-green-100 text-green-800 border-green-200';
    case 'Pendente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Rejeitado': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-stone-100 text-stone-800 border-stone-200';
  }
};

const AuditorsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'requests'>('active');
  const [auditors, setAuditors] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    // Listen for Active Auditors (Approved)
    const qActive = query(collection(db, "auditors"), where("status", "==", "Aprovado"));
    const unsubscribeActive = onSnapshot(qActive, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAuditors(data);
    });

    // Listen for Pending Requests
    const qRequests = query(collection(db, "auditors"), where("status", "==", "Pendente"));
    const unsubscribeRequests = onSnapshot(qRequests, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(data);
    });

    return () => {
      unsubscribeActive();
      unsubscribeRequests();
    };
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await updateDoc(doc(db, "auditors", id), {
        status: "Aprovado"
      });
      alert("Auditor aprovado com sucesso!");
    } catch (error) {
      console.error("Error approving auditor:", error);
      alert("Erro ao aprovar auditor.");
    }
  };

  const handleReject = async (id: string) => {
    if (window.confirm("Tem certeza que deseja rejeitar este cadastro?")) {
      try {
        await updateDoc(doc(db, "auditors", id), {
          status: "Rejeitado"
        });
      } catch (error) {
        console.error("Error rejecting auditor:", error);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-3 text-stone-800">
            <Shield size={28} className="text-purple-600" />
            Credenciamento de Auditores
          </h3>
          <p className="text-stone-500 mt-1">Gerencie o corpo técnico e aprovações.</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={activeTab === 'active' ? 'dark' : 'ghost'}
            onClick={() => setActiveTab('active')}
            size="sm"
          >
            Credenciados
          </Button>
          <Button
            variant={activeTab === 'requests' ? 'dark' : 'ghost'}
            onClick={() => setActiveTab('requests')}
            size="sm"
            rightIcon={requests.length > 0 ? <span className="bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{requests.length}</span> : undefined}
          >
            Solicitações
          </Button>
          <div className="w-px bg-stone-200 mx-2"></div>
          <Button leftIcon={<UserPlus size={18} />}>
            Cadastrar Auditor
          </Button>
        </div>
      </div>

      {activeTab === 'active' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="p-6 border-b border-stone-100 flex items-center gap-4">
            <div className="relative w-full max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input className="w-full pl-10 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all" placeholder="Buscar por nome ou registro..." />
            </div>
          </div>

          <table className="min-w-full divide-y divide-stone-100">
            <thead className="bg-stone-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Nome / Registro</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Especialidade</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Última Auditoria</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-100">
              {auditors.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-stone-500">
                    Nenhum auditor credenciado encontrado.
                  </td>
                </tr>
              )}
              {auditors.map(a => (
                <tr key={a.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-stone-800">{a.nome}</div>
                    <div className="text-xs text-stone-500 font-mono mt-0.5">Reg: {a.registro}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-700">{a.especialidade}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${getStatusColor(a.status)}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-500">{a.lastAudit ? new Date(a.lastAudit).toLocaleDateString('pt-BR') : '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => alert(`Funcionalidade em desenvolvimento: Ver perfil de ${a.nome}`)}
                      className="text-purple-600 hover:text-purple-800 font-medium text-sm flex items-center justify-end gap-1 transition-colors"
                    >
                      Ver Perfil <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.length === 0 && (
            <div className="text-center py-12 bg-stone-50 rounded-2xl border border-stone-100 border-dashed">
              <p className="text-stone-500">Nenhuma solicitação pendente.</p>
            </div>
          )}
          {requests.map(req => (
            <div key={req.id} className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-800">{req.nome}</h4>
                  <p className="text-stone-500 text-sm">{req.registro} • Solicitado em {req.createdAt ? new Date(req.createdAt).toLocaleDateString('pt-BR') : '-'}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" onClick={() => alert(`Funcionalidade em desenvolvimento: Analisar documentos de ${req.nome}`)} leftIcon={<FileText className="w-4 h-4" />}>Analisar Documentos</Button>
                <Button variant="danger" size="sm" onClick={() => handleReject(req.id)} leftIcon={<XCircle className="w-4 h-4" />}>Rejeitar</Button>
                <Button variant="primary" size="sm" onClick={() => handleApprove(req.id)} leftIcon={<CheckCircle className="w-4 h-4" />}>Aprovar Credenciamento</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuditorsView;

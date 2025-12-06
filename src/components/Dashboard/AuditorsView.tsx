import React, { useState, useEffect } from 'react';
import { Shield, UserPlus, Search, ChevronRight, CheckCircle, XCircle, FileText, GraduationCap, Mail, Award, Download, Trash2, Plus } from 'lucide-react';
import Button from '../Button';
import { db } from '../../services/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import Modal from '../Modal';

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newAuditorName, setNewAuditorName] = useState("");
  const [newAuditorEmail, setNewAuditorEmail] = useState("");
  const [newAuditorSpec, setNewAuditorSpec] = useState("");

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "auditors"), {
        nome: newAuditorName,
        email: newAuditorEmail,
        especialidade: newAuditorSpec,
        status: "Aprovado", // Admin created = Pre-approved
        registro: "AUT-" + Math.floor(Math.random() * 10000),
        createdAt: serverTimestamp()
      });
      setIsModalOpen(false);
      setNewAuditorName("");
      setNewAuditorEmail("");
      setNewAuditorSpec("");
    } catch (error) {
      console.error("Error creating auditor:", error);
      alert("Erro ao cadastrar auditor");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este auditor?")) {
      try {
        await deleteDoc(doc(db, "auditors", id));
      } catch (error) {
        console.error("Error deleting auditor:", error);
      }
    }
  };

  const handleExport = () => {
    const headers = ["Nome", "Registro", "E-mail", "Especialidade", "Status"];
    const rows = auditors.map(a => [
      a.nome,
      a.registro,
      a.email,
      a.especialidade,
      a.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "auditores_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 border border-stone-200 rounded-xl text-stone-600 hover:bg-stone-50 transition-colors font-medium bg-white"
          >
            <Download size={18} />
            Exportar
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200 font-medium"
          >
            <Plus size={18} />
            Cadastrar Auditor
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-stone-100">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-3 px-2 text-sm font-medium transition-colors relative ${activeTab === 'active' ? 'text-purple-600' : 'text-stone-500 hover:text-stone-700'}`}
        >
          Credenciados
          {activeTab === 'active' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-t-full"></div>}
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-3 px-2 text-sm font-medium transition-colors relative ${activeTab === 'requests' ? 'text-purple-600' : 'text-stone-500 hover:text-stone-700'}`}
        >
          Solicitações
          {requests.length > 0 && <span className="ml-2 bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full text-xs">{requests.length}</span>}
          {activeTab === 'requests' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-t-full"></div>}
        </button>
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
                <tr key={a.id} className="hover:bg-stone-50 transition-colors group">
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
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => alert(`Funcionalidade em desenvolvimento: Ver perfil de ${a.nome}`)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Ver Perfil"
                      >
                        <ChevronRight size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
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
                <button
                  onClick={() => alert(`Funcionalidade em desenvolvimento: Analisar documentos de ${req.nome}`)}
                  className="flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-xl text-stone-600 hover:bg-stone-50 transition-colors font-medium bg-white text-sm"
                >
                  <FileText size={16} /> Analisar
                </button>
                <button
                  onClick={() => handleReject(req.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium text-sm"
                >
                  <XCircle size={16} /> Rejeitar
                </button>
                <button
                  onClick={() => handleApprove(req.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium text-sm shadow-sm"
                >
                  <CheckCircle size={16} /> Aprovar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Cadastrar Auditor">
        <form onSubmit={handleCreate} className="space-y-6">
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 mb-6">
            <p className="text-sm text-stone-500 mb-4">Informações do profissional para credenciamento.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-bold text-stone-700 mb-2 flex items-center gap-2">
                  <GraduationCap size={16} className="text-purple-600" /> Nome Completo
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all font-medium text-stone-800 placeholder:text-stone-400"
                  placeholder="Ex: Dr. João Silva"
                  value={newAuditorName}
                  onChange={e => setNewAuditorName(e.target.value)}
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-bold text-stone-700 mb-2 flex items-center gap-2">
                  <Mail size={16} className="text-purple-600" /> E-mail Profissional
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all font-medium text-stone-800 placeholder:text-stone-400"
                  placeholder="joao@email.com"
                  value={newAuditorEmail}
                  onChange={e => setNewAuditorEmail(e.target.value)}
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-bold text-stone-700 mb-2 flex items-center gap-2">
                  <Award size={16} className="text-purple-600" /> Especialidade
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all font-medium text-stone-800 placeholder:text-stone-400"
                  placeholder="Ex: Engenharia Ambiental"
                  value={newAuditorSpec}
                  onChange={e => setNewAuditorSpec(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-3 text-stone-600 hover:bg-stone-100 rounded-xl transition-colors font-bold text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-700/20 active:scale-95 transition-all font-bold text-sm flex items-center gap-2"
            >
              <Plus size={18} />
              Cadastrar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AuditorsView;

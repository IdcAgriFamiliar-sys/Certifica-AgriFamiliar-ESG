import React, { useState, useEffect } from 'react';
import { UserPlus, Search, ChevronRight, MapPin, CheckCircle, XCircle, Clock } from 'lucide-react';
// import { Farmer } from '../../types';
import Modal from '../Modal';
import Button from '../Button';
import { db } from '../../services/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc } from 'firebase/firestore';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Certificado': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'Em Avaliação': return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Rejeitado': return 'bg-red-100 text-red-800 border-red-200';
    case 'Pendente': return 'bg-blue-100 text-blue-800 border-blue-200';
    default: return 'bg-stone-100 text-stone-800 border-stone-200';
  }
};

const FarmersView: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'requests'>('active');
  const [farmers, setFarmers] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); console.log(loading);

  // Form State
  const [newFarmerName, setNewFarmerName] = useState("");
  const [newFarmerOwner, setNewFarmerOwner] = useState("");
  const [newFarmerLocation, setNewFarmerLocation] = useState("");

  useEffect(() => {
    // Listen for Active Farmers (Approved)
    const qActive = query(collection(db, "farmers"), where("status", "==", "Aprovado"));
    const unsubscribeActive = onSnapshot(qActive, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFarmers(data);
    });

    // Listen for Pending Requests
    const qRequests = query(collection(db, "farmers"), where("status", "==", "Pendente"));
    const unsubscribeRequests = onSnapshot(qRequests, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(data);
      setLoading(false);
    });

    return () => {
      unsubscribeActive();
      unsubscribeRequests();
    };
  }, []);

  const handleApprove = async (id: string, _email: string, _name: string) => {
    try {
      await updateDoc(doc(db, "farmers", id), {
        status: "Aprovado",
        statusCertificacao: "Em Avaliação" // Initial certification status
      });

      // Create User Entry for Login
      // Note: In a real app, this might be triggered by a Cloud Function to ensure consistency
      // But here we do it client-side for simplicity as per requirements
      // We can't create the Auth user here without their password, but we can pre-create the profile
      // Actually, the Auth logic checks the 'farmers' collection, so just updating status to 'Aprovado' 
      // allows them to login via Google if their email matches.

      alert("Agricultor aprovado com sucesso!");
    } catch (error) {
      console.error("Error approving farmer:", error);
      alert("Erro ao aprovar agricultor.");
    }
  };

  const handleReject = async (id: string) => {
    if (window.confirm("Tem certeza que deseja rejeitar este cadastro?")) {
      try {
        await updateDoc(doc(db, "farmers", id), {
          status: "Rejeitado"
        });
      } catch (error) {
        console.error("Error rejecting farmer:", error);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Manual entry by Admin
      await addDoc(collection(db, "farmers"), {
        nomePropriedade: newFarmerName,
        nome: newFarmerOwner,
        localizacao: newFarmerLocation,
        status: "Aprovado",
        statusCertificacao: "Em Avaliação",
        createdAt: new Date().toISOString(),
        email: "", // Manual entry might not have email initially
      });
      setIsModalOpen(false);
      setNewFarmerName("");
      setNewFarmerOwner("");
      setNewFarmerLocation("");
      alert("Agricultor cadastrado com sucesso!");
    } catch (error) {
      console.error("Error adding farmer:", error);
      alert("Erro ao cadastrar agricultor.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-stone-800">Agricultores</h3>
          <p className="text-stone-500">Gerencie os produtores rurais e solicitações de cadastro.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'active' ? 'dark' : 'ghost'}
            onClick={() => setActiveTab('active')}
            size="sm"
          >
            Ativos
          </Button>
          <Button
            variant={activeTab === 'requests' ? 'dark' : 'ghost'}
            onClick={() => setActiveTab('requests')}
            size="sm"
            rightIcon={requests.length > 0 ? <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{requests.length}</span> : undefined}
          >
            Solicitações
          </Button>
          <div className="w-px bg-stone-200 mx-2"></div>
          <Button
            onClick={() => setIsModalOpen(true)}
            leftIcon={<UserPlus size={18} />}
          >
            Novo Cadastro
          </Button>
        </div>
      </div>

      {activeTab === 'active' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="p-6 border-b border-stone-100 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm"
                placeholder="Buscar por nome da propriedade ou proprietário..."
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-100">
              <thead className="bg-stone-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Propriedade</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Localização</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Cadastro</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-stone-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-stone-100">
                {farmers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-stone-500">
                      Nenhum agricultor ativo encontrado.
                    </td>
                  </tr>
                )}
                {farmers.map(f => (
                  <tr key={f.id} className="hover:bg-stone-50/50 transition-colors group cursor-pointer">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 font-bold text-sm border border-stone-200">
                          {(f.nome || "A").charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-stone-800">{f.nomePropriedade || "Sem Propriedade"}</div>
                          <div className="text-xs text-stone-500">{f.nome}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-stone-600 text-sm">
                        <MapPin size={14} className="text-stone-400" />
                        {f.localizacao || "Não informada"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${getStatusColor(f.statusCertificacao || 'Pendente')}`}>
                        {f.statusCertificacao || 'Pendente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                      {f.createdAt ? new Date(f.createdAt).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => alert(`Funcionalidade em desenvolvimento: Ver detalhes de ${f.nomePropriedade}`)}
                        className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-800">{req.nome}</h4>
                  <p className="text-stone-500 text-sm">{req.nomePropriedade} • {req.email}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" onClick={() => alert(`Funcionalidade em desenvolvimento: Ver detalhes de ${req.nome}`)} leftIcon={<Search className="w-4 h-4" />}>Ver Detalhes</Button>
                <Button variant="danger" size="sm" onClick={() => handleReject(req.id)} leftIcon={<XCircle className="w-4 h-4" />}>Rejeitar</Button>
                <Button variant="primary" size="sm" onClick={() => handleApprove(req.id, req.email, req.nome)} leftIcon={<CheckCircle className="w-4 h-4" />}>Aprovar</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Agricultor">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 mb-6">
            <p className="text-sm text-stone-500 mb-4">Dados da propriedade e do responsável.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2 flex items-center gap-2">
                  <UserPlus size={16} className="text-green-600" /> Nome da Propriedade
                </label>
                <input
                  type="text"
                  value={newFarmerName}
                  onChange={e => setNewFarmerName(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-medium text-stone-800 placeholder:text-stone-400"
                  placeholder="Ex: Fazenda Santa Maria"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2 flex items-center gap-2">
                    <UserPlus size={16} className="text-green-600" /> Proprietário
                  </label>
                  <input
                    type="text"
                    value={newFarmerOwner}
                    onChange={e => setNewFarmerOwner(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-medium text-stone-800 placeholder:text-stone-400"
                    placeholder="Nome Completo"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2 flex items-center gap-2">
                    <MapPin size={16} className="text-green-600" /> Localização
                  </label>
                  <input
                    type="text"
                    value={newFarmerLocation}
                    onChange={e => setNewFarmerLocation(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-medium text-stone-800 placeholder:text-stone-400"
                    placeholder="Cidade/Estado"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-3 text-stone-600 hover:bg-stone-100 rounded-xl transition-colors font-bold text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 hover:shadow-lg hover:shadow-green-700/20 active:scale-95 transition-all font-bold text-sm flex items-center gap-2"
            >
              <CheckCircle size={18} />
              Cadastrar Agricultor
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FarmersView;

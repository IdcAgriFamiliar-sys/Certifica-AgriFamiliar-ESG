import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ChevronRight, Plus, User, FileText, AlignLeft } from 'lucide-react';
import Button from '../Button';
import Modal from '../Modal';
import { db } from '../../services/firebase';
import { collection, query, onSnapshot, addDoc, orderBy } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

const AuditsView: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'DSP' | 'DGICA' | 'DGCS'>('DSP');
  const [audits, setAudits] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAuditData, setNewAuditData] = useState({
    farmerName: '',
    type: 'DSP',
    notes: ''
  });

  // Prevent unused var warnings
  console.log(LayoutDashboard);

  useEffect(() => {
    const q = query(collection(db, "audits"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAudits(data);
    });
    return () => unsubscribe();
  }, []);

  const handleCreateAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await addDoc(collection(db, "audits"), {
        ...newAuditData,
        auditorId: user.uid,
        auditorName: user.displayName || "Auditor",
        status: "Em Andamento",
        createdAt: Date.now(),
        date: new Date().toISOString()
      });
      setIsModalOpen(false);
      setNewAuditData({ farmerName: '', type: 'DSP', notes: '' });
      alert("Auditoria iniciada com sucesso!");
    } catch (error) {
      console.error("Error creating audit:", error);
      alert("Erro ao criar auditoria.");
    }
  };

  const filteredAudits = audits.filter(a => a.type === activeTab);

  const renderContent = () => {
    return (
      <div className="space-y-4">
        <div className={`p-4 rounded-xl border text-sm ${activeTab === 'DSP' ? 'bg-blue-50 border-blue-100 text-blue-800' :
          activeTab === 'DGICA' ? 'bg-green-50 border-green-100 text-green-800' :
            'bg-purple-50 border-purple-100 text-purple-800'
          }`}>
          <strong>
            {activeTab === 'DSP' && 'Diagnóstico Social e Produtivo (DSP): Avalia as condições sociais da família e a estrutura produtiva da propriedade.'}
            {activeTab === 'DGICA' && 'Diagnóstico de Gestão e Indicadores (DGICA): Avalia a gestão da propriedade e indicadores ambientais.'}
            {activeTab === 'DGCS' && 'Diagnóstico de Conformidade Social (DGCS): Verifica o cumprimento de normas sociais e trabalhistas.'}
          </strong>
        </div>

        {filteredAudits.length === 0 ? (
          <div className="text-center py-12 bg-stone-50 rounded-2xl border border-stone-100 border-dashed">
            <p className="text-stone-500">Nenhuma auditoria {activeTab} encontrada.</p>
          </div>
        ) : (
          filteredAudits.map(audit => (
            <div key={audit.id} className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h4 className="font-bold text-stone-800">{audit.farmerName} - {audit.type}</h4>
                <p className="text-stone-500 text-sm">
                  Auditor: {audit.auditorName} • Data: {new Date(audit.createdAt).toLocaleDateString('pt-BR')}
                </p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-2 ${audit.status === 'Concluído' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                  {audit.status}
                </span>
              </div>
              <Button variant="outline" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
                Continuar Auditoria
              </Button>
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-stone-800">Auditorias</h3>
          <p className="text-stone-500">Realize e acompanhe os diagnósticos de certificação.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} leftIcon={<Plus className="w-5 h-5" />}>
          Nova Auditoria
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-stone-200 pb-1">
        {(['DSP', 'DGICA', 'DGCS'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-t-xl font-bold text-sm transition-all relative top-0.5 ${activeTab === tab
              ? 'bg-white border border-stone-200 border-b-white text-green-600'
              : 'bg-stone-50 text-stone-500 hover:bg-stone-100'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-b-2xl rounded-tr-2xl shadow-sm border border-stone-200 border-t-0 p-6 -mt-1">
        {renderContent()}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Auditoria">
        <form onSubmit={handleCreateAudit} className="space-y-6">
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 mb-6">
            <p className="text-sm text-stone-500 mb-4">Dados iniciais para o agendamento.</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2 flex items-center gap-2">
                  <User size={16} className="text-green-600" /> Nome do Agricultor / Propriedade
                </label>
                <input
                  type="text"
                  required
                  value={newAuditData.farmerName}
                  onChange={e => setNewAuditData({ ...newAuditData, farmerName: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-medium text-stone-800 placeholder:text-stone-400"
                  placeholder="Ex: Sítio Esperança"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2 flex items-center gap-2">
                  <FileText size={16} className="text-green-600" /> Tipo de Auditoria
                </label>
                <div className="relative">
                  <select
                    value={newAuditData.type}
                    onChange={e => setNewAuditData({ ...newAuditData, type: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-medium text-stone-800 appearance-none cursor-pointer"
                  >
                    <option value="DSP">DSP - Diagnóstico Social e Produtivo</option>
                    <option value="DGICA">DGICA - Gestão e Indicadores</option>
                    <option value="DGCS">DGCS - Conformidade Social</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2 flex items-center gap-2">
                  <AlignLeft size={16} className="text-green-600" /> Observações Iniciais
                </label>
                <textarea
                  rows={3}
                  value={newAuditData.notes}
                  onChange={e => setNewAuditData({ ...newAuditData, notes: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-medium text-stone-800 placeholder:text-stone-400"
                  placeholder="Observações sobre a visita..."
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
              className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 hover:shadow-lg hover:shadow-green-700/20 active:scale-95 transition-all font-bold text-sm flex items-center gap-2"
            >
              <Plus size={18} />
              Iniciar Auditoria
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AuditsView;

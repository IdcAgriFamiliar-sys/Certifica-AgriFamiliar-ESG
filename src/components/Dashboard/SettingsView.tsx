import React, { useState, useEffect } from "react";
import { Save, Upload, Image as ImageIcon, CheckCircle } from "lucide-react";
import Button from "../Button";
import FileUploadZone from "../FileUploadZone";
import { uploadFile } from "../../services/storage";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../services/firebase";

const SettingsView: React.FC = () => {
  const [config, setConfig] = useState({
    appName: "Certifica ESG AgriFamiliar",
    contactEmail: "contato@idc.org.br",
    logos: {
      idc: "",
      seal: "",
      partners: [] as string[],
    }
  });

  const [idcFile, setIdcFile] = useState<File | null>(null);
  const [sealFile, setSealFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load settings
    const loadSettings = async () => {
      const docRef = doc(db, "settings", "appConfig");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setConfig(docSnap.data() as any);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      let idcUrl = config.logos.idc;
      let sealUrl = config.logos.seal;

      if (idcFile) {
        idcUrl = await uploadFile(idcFile, "settings/logos");
      }
      if (sealFile) {
        sealUrl = await uploadFile(sealFile, "settings/logos");
      }

      const newConfig = {
        ...config,
        logos: {
          ...config.logos,
          idc: idcUrl,
          seal: sealUrl,
        }
      };

      await setDoc(doc(db, "settings", "appConfig"), newConfig);
      setConfig(newConfig);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Erro ao salvar configurações.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h3 className="text-2xl font-bold text-stone-800">Configurações do Sistema</h3>
        <p className="text-stone-500">Gerencie a identidade visual e parâmetros do aplicativo.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 space-y-8">
        <section className="space-y-4">
          <h4 className="text-lg font-bold text-stone-800 border-b border-stone-100 pb-2">Informações Gerais</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Nome da Aplicação</label>
              <input
                value={config.appName}
                onChange={(e) => setConfig({ ...config, appName: e.target.value })}
                className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">E-mail de Contato</label>
              <input
                value={config.contactEmail}
                onChange={(e) => setConfig({ ...config, contactEmail: e.target.value })}
                className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h4 className="text-lg font-bold text-stone-800 border-b border-stone-100 pb-2">Identidade Visual</h4>

          <div className="grid md:grid-cols-2 gap-8">
            {/* IDC Logo */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-stone-700">Logotipo do IDC</label>
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 bg-stone-100 rounded-xl flex items-center justify-center border border-stone-200 overflow-hidden">
                  {config.logos.idc || idcFile ? (
                    <img
                      src={idcFile ? URL.createObjectURL(idcFile) : config.logos.idc}
                      alt="IDC Logo"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <ImageIcon className="text-stone-400" />
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    id="idc-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => e.target.files && setIdcFile(e.target.files[0])}
                  />
                  <label
                    htmlFor="idc-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 cursor-pointer transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Carregar Imagem
                  </label>
                  <p className="text-xs text-stone-400 mt-2">Recomendado: 500x500px, PNG transparente.</p>
                </div>
              </div>
            </div>

            {/* Seal Logo */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-stone-700">Logotipo do Selo ESG</label>
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 bg-stone-100 rounded-xl flex items-center justify-center border border-stone-200 overflow-hidden">
                  {config.logos.seal || sealFile ? (
                    <img
                      src={sealFile ? URL.createObjectURL(sealFile) : config.logos.seal}
                      alt="Seal Logo"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <ImageIcon className="text-stone-400" />
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    id="seal-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => e.target.files && setSealFile(e.target.files[0])}
                  />
                  <label
                    htmlFor="seal-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 cursor-pointer transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Carregar Imagem
                  </label>
                  <p className="text-xs text-stone-400 mt-2">Recomendado: 500x500px, PNG transparente.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="pt-4 flex justify-end">
          <Button
            onClick={handleSave}
            isLoading={loading}
            rightIcon={saved ? <CheckCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />}
            variant={saved ? "success" : "dark"}
          >
            {saved ? "Salvo com Sucesso!" : "Salvar Alterações"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;

import React from 'react';
import { X, HelpCircle, Mail, MessageCircle, AlertTriangle } from 'lucide-react';
import Button from './Button';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const SupportModal: React.FC<Props> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
                {/* Header */}
                <div className="bg-green-600 p-6 flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <HelpCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Central de Ajuda</h3>
                            <p className="text-green-100 text-sm">Como podemos ajudar você?</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">

                    <div className="space-y-6">
                        {/* Common Problems */}
                        <section>
                            <h4 className="text-sm font-bold text-stone-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-500" />
                                Dúvidas Frequentes
                            </h4>

                            <div className="space-y-3">
                                <details className="group bg-stone-50 rounded-xl border border-stone-100 overflow-hidden">
                                    <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-stone-700 hover:bg-stone-100 transition-colors">
                                        Esqueci minha senha
                                        <span className="transition group-open:rotate-180">
                                            <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                        </span>
                                    </summary>
                                    <div className="p-4 pt-0 text-stone-500 text-sm leading-relaxed border-t border-stone-100 mt-2">
                                        Como o acesso é feito via Google, você deve recuperar sua senha diretamente no site do Google (Gmail). Nós não gerenciamos sua senha.
                                    </div>
                                </details>

                                <details className="group bg-stone-50 rounded-xl border border-stone-100 overflow-hidden">
                                    <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-stone-700 hover:bg-stone-100 transition-colors">
                                        O e-mail já está em uso
                                        <span className="transition group-open:rotate-180">
                                            <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                        </span>
                                    </summary>
                                    <div className="p-4 pt-0 text-stone-500 text-sm leading-relaxed border-t border-stone-100 mt-2">
                                        Se você já se cadastrou anteriormente, basta clicar em "Entrar com Google" na tela de login. Se não lembrar qual conta usou, entre em contato com nosso suporte.
                                    </div>
                                </details>

                                <details className="group bg-stone-50 rounded-xl border border-stone-100 overflow-hidden">
                                    <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-stone-700 hover:bg-stone-100 transition-colors">
                                        Não consigo enviar meus documentos
                                        <span className="transition group-open:rotate-180">
                                            <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                        </span>
                                    </summary>
                                    <div className="p-4 pt-0 text-stone-500 text-sm leading-relaxed border-t border-stone-100 mt-2">
                                        Verifique se os arquivos estão nos formatos PDF, JPG ou PNG e se sua conexão com a internet está estável. Você pode pular essa etapa no cadastro e enviar depois pelo Painel.
                                    </div>
                                </details>
                            </div>
                        </section>

                        {/* Contact Channels */}
                        <section>
                            <h4 className="text-sm font-bold text-stone-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <MessageCircle className="w-4 h-4 text-green-500" />
                                Fale com o Suporte
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <a href="mailto:suporte@certificaesg.com.br" className="flex flex-col items-center justify-center p-4 rounded-xl border border-stone-200 hover:border-green-500 hover:bg-green-50 transition-all group">
                                    <Mail className="w-6 h-6 text-stone-400 group-hover:text-green-600 mb-2" />
                                    <span className="text-sm font-bold text-stone-700 group-hover:text-green-700">E-mail</span>
                                </a>
                                <a href="https://wa.me/5511999999999" target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center p-4 rounded-xl border border-stone-200 hover:border-green-500 hover:bg-green-50 transition-all group">
                                    <MessageCircle className="w-6 h-6 text-stone-400 group-hover:text-green-600 mb-2" />
                                    <span className="text-sm font-bold text-stone-700 group-hover:text-green-700">WhatsApp</span>
                                </a>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-stone-50 border-t border-stone-100 text-center">
                    <Button variant="outline" onClick={onClose} fullWidth>
                        Fechar
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SupportModal;

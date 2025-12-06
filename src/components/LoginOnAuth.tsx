import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { ArrowLeft, Leaf, HelpCircle } from "lucide-react";
import Button from "./Button";
import SupportModal from "./SupportModal";
// import SeloLogo from "../assets/SeloESGAgriFamiliar.png";
// import { sendPasswordResetEmail } from "firebase/auth";
// import { auth } from "../services/firebase";

interface Props {
  onLogin: () => void;
  onBack: () => void;
}

const Login: React.FC<Props> = ({ onLogin, onBack }) => {
  const { loginWithGoogle, loginAsDev } = useAuth();
  // const [email, setEmail] = useState("");
  // const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  // const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  // Prevent unused var warnings
  // Prevent unused var warnings
  // console.log(setEmail, setSenha, success);



  const handleGoogleLogin = async () => {
    setError("");

    setLoading(true);
    try {
      await loginWithGoogle();
      onLogin();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao entrar com Google.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl shadow-stone-200/50 overflow-hidden border border-stone-100">
        <div className="p-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mb-6 -ml-2"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Voltar
          </Button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-stone-900">Bem-vindo de volta</h2>
            <p className="text-stone-500 mt-2">Acesse sua conta para continuar</p>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {error}
              </div>
            )}

            <div className="text-center text-stone-500 text-sm mb-4">
              O acesso é exclusivo via Google para usuários cadastrados e aprovados.
            </div>

            <Button
              type="button"
              variant="outline"
              fullWidth
              size="lg"
              onClick={handleGoogleLogin}
              isLoading={loading}
              leftIcon={
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              }
            >
              Entrar com Google
            </Button>
            {import.meta.env.DEV && (
              <Button
                type="button"
                variant="ghost"
                fullWidth
                size="sm"
                className="mt-2 text-stone-400"
                onClick={async () => {
                  if (loginAsDev) {
                    await loginAsDev();
                    onLogin();
                  }
                }}
              >
                [Dev] Entrar como Admin
              </Button>
            )}
          </div>
        </div>
        <div className="bg-stone-50 p-6 text-center border-t border-stone-100">
          <p className="text-sm text-stone-500">
            Ainda não tem conta?{" "}
            <button onClick={onBack} className="text-green-600 font-bold hover:underline">
              Cadastre-se
            </button>
          </p>
          <button
            onClick={() => setIsSupportOpen(true)}
            className="mt-4 text-xs text-stone-400 hover:text-green-600 flex items-center justify-center gap-1 mx-auto transition-colors"
          >
            <HelpCircle className="w-3 h-3" />
            Problemas para entrar?
          </button>
        </div>
      </div>
      <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
    </div>
  );
};

export default Login;

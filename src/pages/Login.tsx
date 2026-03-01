import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";
import { Lock } from "lucide-react";

export default function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(password);
      navigate("/", { replace: true });
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-950 via-surface-900 to-surface-950" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-brand-500/5 blur-[120px]" />

      <div className="relative w-full max-w-sm animate-fade-up">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <h1
            className="text-4xl font-bold tracking-tight text-brand-400"
            style={{ fontFamily: "var(--font-display)" }}
          >
            WChic
          </h1>
          <p className="text-surface-300 text-sm mt-2 tracking-wide uppercase">
            Dashboard de Leads
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface-900/60 backdrop-blur-xl border border-surface-200/10 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <Lock size={18} className="text-brand-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-surface-100">Acesso restrito</p>
              <p className="text-xs text-surface-300">Digite a senha para entrar</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              autoFocus
              className="w-full px-4 py-3 rounded-xl bg-surface-950/80 border border-surface-200/10
                         text-surface-100 placeholder-surface-300/50
                         focus:outline-none focus:border-brand-500/40 focus:ring-1 focus:ring-brand-500/20
                         transition-all duration-200"
            />

            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 rounded-xl font-medium text-sm tracking-wide
                         bg-gradient-to-r from-brand-500 to-brand-600
                         hover:from-brand-400 hover:to-brand-500
                         disabled:opacity-40 disabled:cursor-not-allowed
                         text-white shadow-lg shadow-brand-500/20
                         transition-all duration-200"
            >
              {loading ? "Entrando…" : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

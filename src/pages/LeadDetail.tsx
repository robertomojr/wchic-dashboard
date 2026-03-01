import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchLeadDetail, type LeadDetail } from "../api";
import {
  ArrowLeft,
  Phone,
  MapPin,
  Calendar,
  Users,
  Tag,
  Building2,
  CheckCircle2,
  Circle,
} from "lucide-react";

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 13) {
    return `(${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9)}`;
  }
  return phone;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<LeadDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchLeadDetail(id)
      .then(setData)
      .catch(() => navigate("/", { replace: true }))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-surface-300 text-sm">
        Carregando…
      </div>
    );
  }

  const { lead, messages } = data;
  const isQualified =
    lead.cidade &&
    lead.event_start_date &&
    lead.perfil_evento_universal &&
    lead.pessoas_estimadas;

  const infoItems = [
    { icon: Phone, label: "Telefone", value: formatPhone(lead.phone_e164) },
    {
      icon: MapPin,
      label: "Cidade",
      value: lead.cidade ? `${lead.cidade}/${lead.estado}` : "Não informado",
    },
    { icon: Calendar, label: "Data do evento", value: formatDate(lead.event_start_date) },
    { icon: Tag, label: "Perfil", value: lead.perfil_evento_universal ?? "Não informado" },
    { icon: Users, label: "Convidados", value: lead.pessoas_estimadas ?? "Não informado" },
    { icon: Building2, label: "Franquia", value: lead.franchise_name },
  ];

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Header */}
      <header className="border-b border-surface-200/8 bg-surface-900/40 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 -ml-2 rounded-lg text-surface-300 hover:text-surface-100 hover:bg-surface-200/10 transition"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-surface-100 truncate">
              {formatPhone(lead.phone_e164)}
            </h1>
            <p className="text-xs text-surface-300/60">
              Lead criado em{" "}
              {new Date(lead.created_at).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          {isQualified ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-400 text-xs font-medium">
              <CheckCircle2 size={13} />
              Qualificado
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-200/10 text-surface-300 text-xs">
              <Circle size={13} />
              Em andamento
            </span>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Info Panel */}
          <div className="lg:col-span-1 space-y-3 animate-fade-up">
            <div className="bg-surface-900/40 border border-surface-200/8 rounded-2xl p-5">
              <h3 className="text-xs font-medium uppercase tracking-wider text-surface-300/60 mb-4">
                Dados do lead
              </h3>
              <div className="space-y-4">
                {infoItems.map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-200/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.icon size={14} className="text-surface-300/60" />
                    </div>
                    <div>
                      <p className="text-[11px] text-surface-300/50 uppercase tracking-wider">
                        {item.label}
                      </p>
                      <p className="text-sm text-surface-100 capitalize">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {lead.ibge_code && (
              <div className="bg-surface-900/40 border border-surface-200/8 rounded-2xl px-5 py-3">
                <p className="text-[11px] text-surface-300/50">Código IBGE</p>
                <p className="text-sm font-mono text-surface-300">{lead.ibge_code}</p>
              </div>
            )}
          </div>

          {/* Conversation */}
          <div className="lg:col-span-2 animate-fade-up animate-delay-100">
            <div className="bg-surface-900/40 border border-surface-200/8 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-surface-200/8">
                <h3 className="text-sm font-medium text-surface-200">
                  Conversa ({messages.length} mensagens)
                </h3>
              </div>

              <div className="p-5 space-y-3 max-h-[600px] overflow-y-auto">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user" ? "bubble-user" : "bubble-agent"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <p
                        className={`text-[10px] mt-1.5 ${
                          msg.role === "user" ? "text-white/50" : "text-surface-300/40"
                        }`}
                      >
                        {formatDateTime(msg.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

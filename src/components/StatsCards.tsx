import { Users, MapPin, Calendar, CheckCircle } from "lucide-react";

interface Props {
  totals: {
    total_leads: number;
    com_cidade: number;
    com_data: number;
    com_perfil: number;
    qualificados: number;
  };
}

export default function StatsCards({ totals }: Props) {
  const cards = [
    {
      label: "Total de leads",
      value: totals.total_leads,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Com cidade",
      value: totals.com_cidade,
      icon: MapPin,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    {
      label: "Com data",
      value: totals.com_data,
      icon: Calendar,
      color: "text-violet-400",
      bg: "bg-violet-400/10",
    },
    {
      label: "Qualificados",
      value: totals.qualificados,
      icon: CheckCircle,
      color: "text-brand-400",
      bg: "bg-brand-400/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="bg-surface-900/40 border border-surface-200/8 rounded-2xl p-5 hover:border-surface-200/15 transition-colors"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center`}>
              <c.icon size={17} className={c.color} />
            </div>
          </div>
          <p className="text-3xl font-bold text-surface-100">{c.value}</p>
          <p className="text-xs text-surface-300 mt-1">{c.label}</p>
        </div>
      ))}
    </div>
  );
}

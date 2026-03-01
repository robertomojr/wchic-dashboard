interface Props {
  totals: {
    total_leads: number;
    com_cidade: number;
    com_data: number;
    com_perfil: number;
    qualificados: number;
  };
}

export default function Funnel({ totals }: Props) {
  const steps = [
    { label: "Leads recebidos", value: totals.total_leads, color: "bg-blue-400" },
    { label: "Informou cidade", value: totals.com_cidade, color: "bg-emerald-400" },
    { label: "Informou data", value: totals.com_data, color: "bg-violet-400" },
    { label: "Informou perfil", value: totals.com_perfil, color: "bg-pink-400" },
    { label: "Qualificação completa", value: totals.qualificados, color: "bg-brand-400" },
  ];

  const max = Math.max(totals.total_leads, 1);

  return (
    <div className="bg-surface-900/40 border border-surface-200/8 rounded-2xl p-5">
      <h3 className="text-sm font-medium text-surface-300 mb-4">Funil de qualificação</h3>
      <div className="space-y-3">
        {steps.map((step, i) => {
          const pct = (step.value / max) * 100;
          const prevValue = i > 0 ? steps[i - 1].value : null;
          const dropPct =
            prevValue && prevValue > 0
              ? Math.round(((prevValue - step.value) / prevValue) * 100)
              : null;

          return (
            <div key={step.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-surface-300">{step.label}</span>
                <div className="flex items-center gap-2">
                  {dropPct !== null && dropPct > 0 && (
                    <span className="text-[10px] text-red-400/70">-{dropPct}%</span>
                  )}
                  <span className="text-sm font-semibold text-surface-100">{step.value}</span>
                </div>
              </div>
              <div className="h-2.5 bg-surface-950/60 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${step.color} transition-all duration-700`}
                  style={{ width: `${Math.max(pct, 2)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

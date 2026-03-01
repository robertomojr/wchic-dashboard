import { ChevronLeft, ChevronRight, MessageSquare, CheckCircle2, Circle } from "lucide-react";
import type { LeadsResponse } from "../api";

interface Props {
  data: LeadsResponse;
  onPageChange: (page: number) => void;
  onRowClick: (id: string) => void;
}

function formatPhone(phone: string): string {
  // +5511999999999 → (11) 99999-9999
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 13) {
    return `(${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9)}`;
  }
  return phone;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("pt-BR");
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "agora";
  if (mins < 60) return `${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export default function LeadsTable({ data, onPageChange, onRowClick }: Props) {
  if (data.leads.length === 0) {
    return (
      <div className="py-16 text-center text-surface-300/50 text-sm">
        Nenhum lead encontrado
      </div>
    );
  }

  return (
    <>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-surface-300/60 text-xs uppercase tracking-wider">
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium">Telefone</th>
              <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Cidade</th>
              <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Evento</th>
              <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Data</th>
              <th className="text-left px-5 py-3 font-medium hidden lg:table-cell">Franquia</th>
              <th className="text-right px-5 py-3 font-medium">Msgs</th>
              <th className="text-right px-5 py-3 font-medium">Quando</th>
            </tr>
          </thead>
          <tbody>
            {data.leads.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => onRowClick(lead.id)}
                className="border-t border-surface-200/5 hover:bg-surface-200/5 cursor-pointer transition-colors"
              >
                <td className="px-5 py-3.5">
                  {lead.qualificado ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                      <CheckCircle2 size={13} />
                      Qualificado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs text-surface-300/60">
                      <Circle size={13} />
                      Em andamento
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5 font-mono text-xs text-surface-100">
                  {formatPhone(lead.phone_e164)}
                </td>
                <td className="px-5 py-3.5 hidden sm:table-cell text-surface-200">
                  {lead.cidade ? `${lead.cidade}/${lead.estado}` : "—"}
                </td>
                <td className="px-5 py-3.5 hidden md:table-cell text-surface-200 capitalize">
                  {lead.perfil_evento_universal ?? "—"}
                </td>
                <td className="px-5 py-3.5 hidden md:table-cell text-surface-200">
                  {formatDate(lead.event_start_date)}
                </td>
                <td className="px-5 py-3.5 hidden lg:table-cell text-surface-300 text-xs">
                  {lead.franchise_name}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <span className="inline-flex items-center gap-1 text-xs text-surface-300/60">
                    <MessageSquare size={12} />
                    {lead.msg_count}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right text-xs text-surface-300/60">
                  {timeAgo(lead.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-surface-200/8 text-xs text-surface-300">
          <span>
            {data.total} lead{data.total !== 1 ? "s" : ""} · Página {data.page}/{data.totalPages}
          </span>
          <div className="flex gap-1">
            <button
              disabled={data.page <= 1}
              onClick={() => onPageChange(data.page - 1)}
              className="p-1.5 rounded-lg hover:bg-surface-200/10 disabled:opacity-30 transition"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              disabled={data.page >= data.totalPages}
              onClick={() => onPageChange(data.page + 1)}
              className="p-1.5 rounded-lg hover:bg-surface-200/10 disabled:opacity-30 transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchStats,
  fetchLeads,
  fetchFranchises,
  clearToken,
  type DashStats,
  type LeadsResponse,
  type Franchise,
} from "../api";
import StatsCards from "../components/StatsCards";
import Funnel from "../components/Funnel";
import LeadsTable from "../components/LeadsTable";
import DailyChart from "../components/DailyChart";
import { LogOut, RefreshCw, Search } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashStats | null>(null);
  const [leads, setLeads] = useState<LeadsResponse | null>(null);
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [franchise, setFranchise] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [s, l, f] = await Promise.all([
        fetchStats(),
        fetchLeads({ franchise, q: search, page }),
        franchises.length ? Promise.resolve(franchises) : fetchFranchises(),
      ]);
      setStats(s);
      setLeads(l);
      if (!franchises.length) setFranchises(f as Franchise[]);
    } catch {
      // auth error handled by api.ts
    } finally {
      setLoading(false);
    }
  }, [franchise, search, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Debounced search
  const [searchInput, setSearchInput] = useState("");
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  function handleLogout() {
    clearToken();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Header */}
      <header className="border-b border-surface-200/8 bg-surface-900/40 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1
              className="text-2xl font-bold text-brand-400"
              style={{ fontFamily: "var(--font-display)" }}
            >
              WChic
            </h1>
            <span className="text-xs tracking-widest uppercase text-surface-300/60 hidden sm:inline">
              Dashboard
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="p-2 rounded-lg text-surface-300 hover:text-surface-100 hover:bg-surface-200/10 transition"
              title="Atualizar"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-surface-300 hover:text-red-400 hover:bg-red-400/10 transition"
              title="Sair"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats Cards */}
        {stats && (
          <div className="animate-fade-up">
            <StatsCards totals={stats.totals} />
          </div>
        )}

        {/* Funnel + Daily Chart row */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-up animate-delay-100">
            <Funnel totals={stats.totals} />
            <DailyChart data={stats.daily} />
          </div>
        )}

        {/* Franchise breakdown */}
        {stats && stats.byFranchise.length > 1 && (
          <div className="bg-surface-900/40 border border-surface-200/8 rounded-2xl p-5 animate-fade-up animate-delay-200">
            <h3 className="text-sm font-medium text-surface-300 mb-3">Por franquia</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {stats.byFranchise.map((f) => (
                <div
                  key={f.franchise_id ?? "none"}
                  className="bg-surface-950/50 rounded-xl p-4 border border-surface-200/5"
                >
                  <p className="text-sm font-medium text-surface-100 truncate">{f.franchise_name}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold text-brand-400">{f.qualificados}</span>
                    <span className="text-xs text-surface-300">/ {f.total} leads</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters + Table */}
        <div className="bg-surface-900/40 border border-surface-200/8 rounded-2xl overflow-hidden animate-fade-up animate-delay-300">
          {/* Filter bar */}
          <div className="px-5 py-4 border-b border-surface-200/8 flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-300/50"
              />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Buscar telefone ou cidade…"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-950/60 border border-surface-200/10
                           text-sm text-surface-100 placeholder-surface-300/40
                           focus:outline-none focus:border-brand-500/30 transition"
              />
            </div>

            {/* Franchise filter */}
            <select
              value={franchise}
              onChange={(e) => { setFranchise(e.target.value); setPage(1); }}
              className="px-3 py-2 rounded-lg bg-surface-950/60 border border-surface-200/10
                         text-sm text-surface-100 focus:outline-none focus:border-brand-500/30 transition"
            >
              <option value="all">Todas as franquias</option>
              {franchises.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Table */}
          {leads && (
            <LeadsTable
              data={leads}
              onPageChange={setPage}
              onRowClick={(id) => navigate(`/leads/${id}`)}
            />
          )}
        </div>
      </main>
    </div>
  );
}

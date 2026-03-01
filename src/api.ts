const API_BASE = import.meta.env.VITE_API_URL ?? "";

function getToken(): string | null {
  return sessionStorage.getItem("wchic_token");
}

export function setToken(token: string) {
  sessionStorage.setItem("wchic_token", token);
}

export function clearToken() {
  sessionStorage.removeItem("wchic_token");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> ?? {}),
  };

  const res = await fetch(`${API_BASE}/dash${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    clearToken();
    window.location.href = "/login";
    throw new Error("Sessão expirada");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }

  return res.json();
}

// --- Auth ---
export async function login(password: string): Promise<string> {
  const data = await request<{ token: string }>("/login", {
    method: "POST",
    body: JSON.stringify({ password }),
  });
  setToken(data.token);
  return data.token;
}

// --- Stats ---
export interface DashStats {
  totals: {
    total_leads: number;
    com_cidade: number;
    com_data: number;
    com_perfil: number;
    qualificados: number;
  };
  byFranchise: Array<{
    franchise_name: string;
    franchise_id: string | null;
    total: number;
    qualificados: number;
  }>;
  daily: Array<{ day: string; count: number }>;
}

export function fetchStats(): Promise<DashStats> {
  return request("/stats");
}

// --- Leads ---
export interface LeadRow {
  id: string;
  phone_e164: string;
  source: string;
  status: string | null;
  territory_status: string | null;
  franchise_id: string | null;
  franchise_name: string;
  created_at: string;
  updated_at: string;
  cidade: string | null;
  estado: string | null;
  event_start_date: string | null;
  perfil_evento_universal: string | null;
  pessoas_estimadas: string | null;
  qualificado: boolean;
  msg_count: number;
}

export interface LeadsResponse {
  leads: LeadRow[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function fetchLeads(params: {
  franchise?: string;
  status?: string;
  q?: string;
  page?: number;
}): Promise<LeadsResponse> {
  const sp = new URLSearchParams();
  if (params.franchise && params.franchise !== "all") sp.set("franchise", params.franchise);
  if (params.status) sp.set("status", params.status);
  if (params.q) sp.set("q", params.q);
  if (params.page) sp.set("page", String(params.page));
  return request(`/leads?${sp.toString()}`);
}

// --- Lead Detail ---
export interface LeadDetail {
  lead: LeadRow & {
    ibge_code: string | null;
    event_end_date: string | null;
    decisor: boolean | null;
  };
  messages: Array<{
    role: "user" | "agent" | "system";
    content: string;
    stage: string | null;
    created_at: string;
  }>;
}

export function fetchLeadDetail(id: string): Promise<LeadDetail> {
  return request(`/leads/${id}`);
}

// --- Franchises ---
export interface Franchise {
  id: string;
  name: string;
  workspace_key: string;
}

export function fetchFranchises(): Promise<Franchise[]> {
  return request("/franchises");
}

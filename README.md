# WChic Dashboard — Tarefa #14

## Arquitetura

```
wchic-backend (Render)          wchic-dashboard (Render Static / Vercel)
├── src/routes/dashboard.ts     ├── src/pages/Login.tsx
│   POST /dash/login            ├── src/pages/Dashboard.tsx
│   GET  /dash/stats            ├── src/pages/LeadDetail.tsx
│   GET  /dash/leads            └── src/components/...
│   GET  /dash/leads/:id
│   GET  /dash/franchises
```

---

## 1. Backend — Adicionar rotas do Dashboard

### 1.1 Copie o arquivo
```bash
cp dashboard.ts ~/wchic-backend/src/routes/dashboard.ts
```

### 1.2 Registre a rota no `src/index.ts` (ou `app.ts`)
Adicione junto com os outros `app.use(...)`:

```ts
import { dashboardRouter } from "./routes/dashboard.js";

// ... depois de outros app.use() ...
app.use("/dash", dashboardRouter);
```

### 1.3 Habilite CORS para o dashboard
Se ainda não tiver CORS, instale e configure:

```bash
npm install cors @types/cors
```

No `src/index.ts`:
```ts
import cors from "cors";

app.use(cors({
  origin: process.env.DASHBOARD_URL ?? "*",
  credentials: true,
}));
```

### 1.4 Configure a variável de ambiente no Render
No Render Dashboard → wchic-backend → Environment:

```
DASHBOARD_PASSWORD=escolha_uma_senha_forte
DASHBOARD_URL=https://wchic-dashboard.onrender.com   (após deploy do frontend)
```

### 1.5 Deploy
```bash
cd ~/wchic-backend
git add src/routes/dashboard.ts
git commit -m "feat: adiciona API do dashboard (#14)"
git push origin main
```

---

## 2. Frontend — Deploy do Dashboard React

### 2.1 Crie o repo
```bash
cd ~/wchic-dashboard
git init
git add .
git commit -m "feat: dashboard SPA inicial (#14)"
```

Crie o repo no GitHub (ex: `wchic-dashboard`) e faça push:
```bash
git remote add origin git@github.com:SEU_USER/wchic-dashboard.git
git branch -M main
git push -u origin main
```

### 2.2 Instale as dependências localmente (para testar)
```bash
npm install
npm run dev
```
Acesse `http://localhost:5173` — o Vite faz proxy das chamadas `/dash` para `localhost:3000` (backend local).

### 2.3 Deploy no Render (Static Site)

1. Render Dashboard → **New** → **Static Site**
2. Conecte o repo `wchic-dashboard`
3. Configurações:
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
   - **Environment Variables:**
     ```
     VITE_API_URL=https://wchic-backend.onrender.com
     ```
4. Em **Redirects/Rewrites**, adicione:
   - Source: `/*`  →  Destination: `/index.html`  →  Action: **Rewrite**
   (necessário para o React Router funcionar)

### Alternativa: Deploy no Vercel
```bash
npm i -g vercel
vercel
```
Configure `VITE_API_URL` nas environment variables do Vercel.

---

## 3. Testar

1. Acesse a URL do dashboard
2. Digite a senha configurada em `DASHBOARD_PASSWORD`
3. Você deve ver os leads, funil, e poder clicar em cada lead para ver a conversa

---

## Funcionalidades

| Feature | Descrição |
|---|---|
| **Login** | Senha fixa configurada via env var, token válido por 24h |
| **Stats cards** | Total de leads, com cidade, com data, qualificados |
| **Funil** | Barra visual mostrando drop-off entre cada etapa |
| **Gráfico diário** | Leads recebidos por dia (últimos 30 dias) |
| **Por franquia** | Cards com total e qualificados por franquia |
| **Tabela de leads** | Busca por telefone/cidade, filtro por franquia, paginação |
| **Detalhe do lead** | Dados coletados + histórico completo da conversa |

# ⛪ OD Mooca Manager

Sistema de gerenciamento de escalas de voluntários da igreja **Onda Dura Mooca**.

[![CI](https://github.com/gustavohcserafim/odmooca-manager/actions/workflows/ci.yml/badge.svg)](https://github.com/gustavohcserafim/odmooca-manager/actions)

🔗 **Produção**: [odmooca-manager-web.vercel.app](https://odmooca-manager-web.vercel.app)

---

## ✨ Funcionalidades

### Autenticação

- Login via **Magic Link** (e-mail) — sem senha
- Rotas protegidas com middleware
- Sign-out integrado

### Ministérios

- Cadastrar, editar e excluir ministérios (ex: Louvor, Mídia, Recepção)
- Validação de nome (3–150 caracteres) e descrição (até 500)

### Membros

- Cadastrar, editar e excluir membros
- Campos: nome, e-mail (único), telefone (10+ dígitos)
- Detecção de e-mail duplicado com mensagem amigável

### Eventos

- Cadastrar cultos e eventos especiais
- Tipos: Culto de Domingo, Culto de Quarta, Evento Especial
- Data e hora com formatação pt-BR

### Escalas

- Escala automática criada por evento (rascunho)
- Escalar voluntários: selecionar membro + ministério + função
- Visualização agrupada por ministério
- Remover voluntários da escala
- Publicar escala quando pronta (Rascunho → Publicada)

---

## 🛠️ Tech Stack

| Camada       | Tecnologia                                    |
| ------------ | --------------------------------------------- |
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript |
| **Estilo**   | Tailwind CSS 4, Shadcn/ui                     |
| **Backend**  | Supabase (PostgreSQL, Auth, RLS)              |
| **Testes**   | Vitest, Testing Library (67 testes)           |
| **CI/CD**    | GitHub Actions + Vercel                       |
| **Monorepo** | npm workspaces                                |
| **PWA**      | Manifest + mobile-first                       |

---

## 📁 Estrutura

```
odmooca-manager/
├── apps/web/                 # Next.js PWA
│   └── src/
│       ├── core/             # Validação pura (testável, sem deps)
│       ├── services/         # CRUD Supabase
│       ├── lib/              # Clients, tipos compartilhados
│       ├── components/       # Forms, Cards reutilizáveis
│       └── app/dashboard/    # Páginas protegidas
│           ├── ministries/
│           ├── members/
│           └── events/
│               └── [id]/schedule/
├── packages/shared/          # Tipos do domínio
├── supabase/migrations/      # Schema SQL
└── .github/workflows/        # CI
```

---

## 🚀 Setup Local

```bash
# Clonar
git clone https://github.com/gustavohcserafim/odmooca-manager.git
cd odmooca-manager

# Instalar
npm install

# Configurar variáveis de ambiente
cp apps/web/.env.example apps/web/.env.local
# Editar .env.local com suas credenciais Supabase

# Rodar
npm run dev        # http://localhost:3000

# Testes
npm run test       # 67 testes
npm run lint       # ESLint
npm run format     # Prettier
```

---

## 📊 Banco de Dados

6 tabelas com RLS habilitado:

- `members` — Membros da igreja
- `ministries` — Ministérios
- `volunteer_roles` — Vínculo membro ↔ ministério
- `events` — Cultos e eventos
- `schedules` — Escalas por evento
- `schedule_assignments` — Voluntários escalados

---

## 📝 Princípios

- **XP mediado por IA** — TDD, small releases, simplicidade
- **Mobile-first** — PWA instalável
- **Código em inglês, UI em português** (pt-BR)
- **Hospedagem gratuita** — Vercel + Supabase free tier

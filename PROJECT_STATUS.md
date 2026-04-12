# Vendflow — Status do Projeto e Próximos Passos

> **Última atualização:** 2026-04-12
> **Branch:** `main`
> **Deploy:** Vercel (duas apps separadas)

---

## 1. Visão geral do produto

**Vendflow** é um SaaS de e-commerce focado em lojistas de cosméticos. Cada lojista ganha uma loja virtual pronta (`vendflow-store.vercel.app/<slug>`), aceita pagamentos via Mercado Pago (Checkout Pro / PIX), e administra tudo num dashboard próprio. O dono do SaaS tem um painel admin que mostra KPIs de todas as lojas.

**Personas:**
- **Lojista** → usa o dashboard pra cadastrar produtos, ver pedidos, configurar loja e pagamentos
- **Cliente final** → compra na loja pública do lojista
- **Dono do SaaS (admin)** → acompanha crescimento da plataforma, KPIs, lojas ativas

---

## 2. Arquitetura

### Monorepo (Turborepo + pnpm)

```
vendflow/
├── apps/
│   ├── web/    → Landing page de marketing (vendflow.vercel.app)
│   ├── app/    → Dashboard do lojista + Admin panel (vendflow-app.vercel.app)
│   └── store/  → Loja pública do cliente final (vendflow-store.vercel.app/[slug])
├── packages/
│   ├── database/  → Prisma schema + client compartilhado
│   ├── ui/        → (placeholder, sem uso ativo)
│   └── config/    → (placeholder)
└── PROJECT_STATUS.md  ← este arquivo
```

### Stack
- **Next.js 15** (App Router, RSC, route groups)
- **Prisma 5.22** + **PostgreSQL** (Supabase, free tier)
- **NextAuth v5 beta** (JWT strategy, role-based)
- **Tailwind CSS 3**
- **Mercado Pago SDK** (Checkout Pro + webhooks)
- **TypeScript 5**
- **Deploy:** Vercel (um projeto por app)

### Route groups no `apps/app`
- `(auth)` → `/login`, `/cadastro` (marketing-style)
- `(dashboard)` → `/dashboard/*` (lojista)
- `(admin)` → `/admin/*` (dono do SaaS, protegido por role)

---

## 3. Schema do banco (Prisma)

Localização: [packages/database/prisma/schema.prisma](packages/database/prisma/schema.prisma)

**Modelos principais:**
- `User` → lojista (campo `role: USER | ADMIN`)
- `Store` → loja do lojista (1:1 com User)
- `MercadoPagoConfig` → tokens OAuth do MP por loja
- `Customer` → comprador de uma loja (1 customer por `(storeId, email)`)
- `Cart` + `CartItem` → carrinho persistente do cliente
- `Product` + `Category` → catálogo da loja
- `Order` + `OrderItem` → pedidos
- `Payment` → referência externa do MP

**Enums:**
- `Role`: USER, ADMIN
- `StoreTheme`: MODERN, YOUNG, ELEGANT, MINIMAL
- `OrderStatus`: PENDING, PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED
- `PaymentStatus`: PENDING, APPROVED, REJECTED, REFUNDED

**Constantes úteis:**
- `PAID_ORDER_STATUSES = [PAID, PROCESSING, SHIPPED, DELIVERED]` → [apps/app/lib/order-status.ts](apps/app/lib/order-status.ts)

**IMPORTANTE:** O schema está aplicado via `prisma db push --accept-data-loss`, NÃO via migration formal. Antes do próximo deploy crítico, rodar `prisma migrate dev --name init` pra formalizar (cuidado com TTY no Windows bash — pode precisar rodar manualmente).

---

## 4. O que já está pronto (features)

### 4.1 Landing page (`apps/web`)
- Hero, Features, HowItWorks, Pricing, Testimonials, Footer
- Links de login/cadastro usam `NEXT_PUBLIC_APP_URL`
- Metadata SEO-friendly
- Copy posicionada em "Pagamentos integrados" (sem mais menção a WhatsApp)

### 4.2 Auth (`apps/app/auth.ts`)
- NextAuth v5 com JWT strategy
- Credentials provider (email + senha com bcrypt)
- Callbacks propagam `role` do banco até a session:
  - `authorize` → inclui role
  - `jwt` callback → `token.role`
  - `session` callback → `session.user.role`
- Tipos estendidos em [apps/app/types/next-auth.d.ts](apps/app/types/next-auth.d.ts)
- Middleware protege `/dashboard/*` ([apps/app/middleware.ts](apps/app/middleware.ts))

### 4.3 Dashboard do lojista (`apps/app/app/(dashboard)`)
- **`/dashboard`** → visão geral com KPIs reais da loja (pedidos, GMV, produtos, clientes)
- **`/dashboard/loja`** → editar nome, slug, descrição, logo, tema
- **`/dashboard/produtos`** → listar, criar, editar, deletar produtos
- **`/dashboard/pedidos`** → listar pedidos + dropdown `OrderStatusSelect` pra mudar status
- **`/dashboard/pagamentos`** → conectar Mercado Pago via OAuth
- Sidebar responsiva com `usePathname()` pra highlight

### 4.4 Admin panel (`apps/app/app/(admin)`)
- **`/admin`** → KPIs do SaaS: lojas ativas, novas no mês, pedidos, GMV 30 dias + gráfico CSS de barras
- **`/admin/lojas`** → tabela com todas as lojas (até 200), GMV, dono, status
- **`/admin/lojas/[id]`** → detalhe: stats, top produtos, últimos 10 pedidos, toggle ativo/inativo
- Guard por role: layout redireciona se `session.user.role !== "ADMIN"`
- Sidebar e header usam `usePathname()` (não dependem do header `x-pathname`)
- `loading.tsx` com skeleton no detalhe da loja pra UX

### 4.5 Loja pública (`apps/store`)
- Rotas dinâmicas por `[slug]`:
  - `/` → landing da loja (nome, hero, produtos em destaque)
  - `/produto/[productSlug]` → página do produto
  - `/carrinho` → carrinho persistente
  - `/login`, `/cadastro` → auth do cliente final (JWT próprio, não NextAuth)
  - `/minha-conta` → histórico de pedidos do cliente
  - `/pedido/[id]` → detalhe do pedido + status
- Metadata dinâmica por loja (título, favicon, theme-color)
- ISR + error/loading boundaries
- `next/image` pra qualidade

### 4.6 Checkout + Mercado Pago (`apps/store/app/api/mercadopago`)
- **Fluxo:** cliente adiciona ao carrinho → checkout → cria preferência no MP → redireciona pro Checkout Pro → webhook marca pedido como `PAID`
- Endpoint: `/api/mercadopago/checkout` (cria preferência)
- Webhook: `/api/mercadopago/webhook` (recebe notificações, marca `PAID`)
- OAuth do lojista: `apps/app/app/api/mercadopago/*` salva access_token por loja
- **Sem mais notificações WhatsApp no webhook** (removidas)

---

## 5. O que foi feito nesta sessão

### 5.1 Pivô: remoção completa do WhatsApp
**Contexto:** Evolution API tinha problemas de protocolo com Baileys, dependia de Docker, aumentava complexidade do MVP. Usuário decidiu abandonar WhatsApp como MVP e deixar como "melhoria futura".

**Mudanças:**
- **Schema:** removidos `WhatsappConfig` model, `Plan` model, `User.planId`, relação `Store.whatsapp`
- **Arquivos deletados:**
  - `apps/app/lib/evolution.ts`
  - `apps/app/lib/whatsapp-notify.ts`
  - `apps/store/lib/whatsapp-notify.ts`
  - `apps/app/app/api/whatsapp/{connect,disconnect,status}/route.ts`
  - `apps/app/app/(dashboard)/dashboard/whatsapp/page.tsx`
  - `apps/app/app/(dashboard)/dashboard/plano/page.tsx`
  - `apps/app/app/(dashboard)/dashboard/whatsapp/WhatsappForm.tsx`
  - `infra/evolution/docker-compose.yml`
- **Edições:**
  - [apps/store/app/api/mercadopago/webhook/route.ts](apps/store/app/api/mercadopago/webhook/route.ts) — removidas chamadas `notifyOrderPaid*`
  - [apps/app/app/api/orders/[id]/status/route.ts](apps/app/app/api/orders/[id]/status/route.ts) — removida chamada `notifyOrderStatus*`
  - `Sidebar.tsx`, `DashboardHeader.tsx`, `dashboard/layout.tsx` — removidos itens de menu
  - `cadastro/page.tsx` — feature "WhatsApp automático" → "Pagamentos integrados"
  - Landing sections (Hero, Features, HowItWorks, Pricing, Testimonials, Footer)
  - `.env.local` — removidas vars `EVOLUTION_API_*`

### 5.2 Admin panel (feature nova)
- Role enum no Prisma + propagação JWT → session
- Route group `(admin)` com layout guardado por role
- Páginas: `/admin`, `/admin/lojas`, `/admin/lojas/[id]`
- API: `PATCH /api/admin/stores/[storeId]/toggle` pra ativar/desativar loja
- Componentes: `AdminSidebar`, `AdminHeader`, `AdminHeaderWrapper`, `ToggleStoreButton`, `ConfirmModal`
- Helpers compartilhados criados:
  - [apps/app/lib/format.ts](apps/app/lib/format.ts) — `brl()`, `storeUrl()`
  - [apps/app/lib/order-status.ts](apps/app/lib/order-status.ts) — `PAID_ORDER_STATUSES`, `statusMap`

### 5.3 Bugs corrigidos
- **Prisma `groupBy` por `createdAt`** retornava uma linha por timestamp exato em vez de por dia → substituído por agregação em memória
- **`o.customer.name` podia crashar** se customer fosse null → `o.customer?.name ?? "—"`
- **Silent fail no ToggleStoreButton** → adicionado `if (!res.ok) return;`
- **Admin sidebar não destacava página ativa** → middleware matcher só cobria `/dashboard/*`, então `x-pathname` nunca era setado pra `/admin/*`. Fix: `usePathname()` client-side no `AdminSidebar` e `AdminHeaderWrapper` (não depende mais do header do middleware)
- **Delay ao abrir detalhe de loja** → adicionado [apps/app/app/(admin)/admin/lojas/[id]/loading.tsx](apps/app/app/(admin)/admin/lojas/[id]/loading.tsx) com skeleton animado pro Suspense boundary automático do Next.js

### 5.4 Otimização de performance (sessão 2)
- **8 índices compostos** adicionados no schema (Order, Product, OrderItem, Customer)
- **Pedidos**: paginação (`take: 50`), counts movidos pro banco, items limitados por pedido
- **Produtos**: `select` cirúrgico em vez de `include`, `take: 100`
- **Admin lojas**: queries paralelizadas com `Promise.all`
- **Admin detalhe loja**: eliminado nested where no `orderItem.groupBy` (substituído por busca de IDs + groupBy por orderId)
- **Cache**: `unstable_cache` em 3 páginas admin (30-60s TTL)
- **Schema formalizado**: migration baseline criada e marcada como applied
- **Seed script**: `packages/database/prisma/seed.ts` cria admin user automaticamente

### 5.5 Segurança do webhook (sessão 2)
- **Verificação HMAC-SHA256** no webhook do MP via header `x-signature` (se `MP_WEBHOOK_SECRET` configurado)
- **Mapeamento O(1) de store** via `?storeId=` na notification_url (eliminou loop O(n) por todos os tokens)
- **Fallback** para pedidos antigos: busca via `external_reference` → `order.storeId`
- **`.env.example`** atualizado com todas as vars necessárias

### 5.6 State machine de pedidos + restore de estoque (sessão 3)
- **State machine** definida em `apps/app/lib/order-status.ts` (`VALID_TRANSITIONS`)
- Fluxo: PENDING → PAID (webhook) → PROCESSING → SHIPPED → DELIVERED
- Cancelamento permitido de: PENDING, PAID, PROCESSING (não de SHIPPED/DELIVERED)
- DELIVERED e CANCELLED são estados finais
- **API** valida transições e retorna erro 422 com mensagem descritiva se inválida
- **Restore de estoque** ao cancelar pedidos que estavam em PAID/PROCESSING/SHIPPED
- **OrderStatusSelect** mostra apenas transições válidas no dropdown

### 5.7 Rate limiting nos endpoints de auth (sessão 3)
- **Tabela `RateLimitEntry`** no Prisma com índice em `[key, createdAt]` — funciona cross-instance (serverless)
- **Helper reutilizável** em `packages/database/src/rate-limit.ts` (`checkRateLimit`, `recordAttempt`)
- **Endpoints protegidos:** customer login (5/15min), customer signup (3/15min), lojista login (5/15min), lojista cadastro (3/15min)
- **HTTP 429** com header `Retry-After` nos API routes
- **Frontend** exibe "Muitas tentativas. Tente novamente mais tarde." automaticamente (mesma mensagem de erro)

### 5.8 Motor de Webhooks Externos — Feature PRO (sessão 3)
- **Schema**: enum `StorePlan` (BASIC, PRO) + campo `webhookUrl` no model Store
- **Página `/dashboard/integracoes`**: configuração de webhook URL com trava visual por plano
- **WebhookService** em `apps/store/lib/webhook-dispatcher.ts`: `dispatchOrderEvent()` fire-and-forget com timeout 10s
- **Payload padronizado**: `{ event: "order.paid", timestamp, data: { orderId, status, total, customer, items } }`
- **Integração**: chamada automática no webhook do MP após confirmação de pagamento PAID
- **Segurança**: só dispara para lojas com `plan === "PRO"` e `webhookUrl` configurada
- **UI PRO gate**: campo desabilitado com aviso "Disponível apenas no plano PRO" para lojas BASIC

---

## 6. Variáveis de ambiente

### `apps/app/.env.local` (dashboard + admin)
```
DATABASE_URL="postgresql://postgres:<pwd>@db.<project>.supabase.co:5432/postgres"
AUTH_SECRET="<random 32 bytes hex>"
AUTH_URL="http://localhost:3001"
NEXT_PUBLIC_STORE_URL="https://vendflow-store.vercel.app"
# Mercado Pago OAuth
MP_CLIENT_ID="..."
MP_CLIENT_SECRET="..."
```

### `apps/store/.env.local` (loja pública)
```
DATABASE_URL="<mesma do apps/app>"
CUSTOMER_JWT_SECRET="<random 32 bytes hex>"
NEXT_PUBLIC_APP_URL="https://vendflow-app.vercel.app"
```

### `apps/web/.env.local` (landing)
```
NEXT_PUBLIC_APP_URL="https://vendflow-app.vercel.app"
```

**Na Vercel:** cada projeto (`web`, `app`, `store`) precisa ter essas vars configuradas no dashboard da Vercel separadamente.

---

## 7. Onde parou

### Último commit
`5cddf18 feat: order status state machine with stock restoration on cancellation`

### Estado atual
- ✅ Código pushed pra `origin/main`
- ✅ Build local passando (apps/app + apps/store)
- ✅ Performance otimizada: índices, paginação, cache, queries paralelas
- ✅ Schema formalizado via migration baseline
- ✅ Seed script de admin user funcional
- ✅ Webhook do Mercado Pago blindado com verificação HMAC-SHA256 e mapeamento O(1) de store
- ✅ Sidebar/skeleton validados em produção
- ✅ `.env.local` não está no git (já estava no `.gitignore`)

### Bugs conhecidos
Nenhum reportado.

---

## 8. Débitos técnicos pendentes

### Segurança (resolver antes de clientes reais)
1. ~~**Rate limiting**~~ ✅ Implementado — 5 tentativas login / 3 signups por IP em 15 min (tabela `RateLimitEntry`)
2. ~~**State machine de pedidos**~~ ✅ Implementada — transições validadas, estados finais protegidos
3. ~~**Estoque não restaurado no cancelamento**~~ ✅ Restauração automática ao cancelar pedidos pagos
4. **Race condition no estoque** — entre criar o pedido e o webhook confirmar, dois clientes podem comprar o mesmo último item
5. ~~**Validação de URLs de imagem**~~ ✅ Imagens agora vêm do R2 (domínio controlado), input de URL externo removido
6. **Senha do customer fraca** — mínimo 6 chars (deveria ser 8+)

### Infraestrutura
7. **Email transacional** — zero notificações (confirmação, status, boas-vindas)
8. ~~**Upload de imagens**~~ ✅ Presigned URLs via Cloudflare R2 (produtos + logo da loja)
9. **Shipping hardcoded** — "Frete grátis acima de R$150" não é configurável pelo lojista
10. **Testes** — zero cobertura (unit, integration, e2e)
11. **Observability** — sem Sentry, sem logs estruturados, sem analytics

---

## 9. Próximos passos sugeridos

### Prioridade alta (pré-launch)
1. ~~State machine de pedidos + restore de estoque~~ ✅
2. ~~Rate limiting nos endpoints de auth~~ ✅
3. ~~Motor de webhooks externos (Feature PRO)~~ ✅
4. ~~Upload de imagens via Cloudflare R2~~ ✅ — presigned URLs, drag & drop, produtos + logo
5. ~~Billing/planos~~ ✅ — Stripe Checkout + Customer Portal + webhook (upgrade/downgrade automático)

### Prioridade média (pós-launch)
6. Filtros e paginação no admin (busca por nome/slug, status)
7. Gráficos com recharts no `/admin`
8. Shipping configurável pelo lojista
9. Mais eventos de webhook (order.shipped, order.cancelled, etc.)

### Prioridade baixa (futuro)
10. Email transacional (Resend ou Nodemailer + templates)
11. WhatsApp automation (via n8n + webhook do Vendflow)
12. Guest checkout (hoje obriga criar conta)
13. Cron jobs (carrinho abandonado, relatórios)
14. Testes automatizados
15. Observability (Sentry, analytics)

---

## 10. Comandos úteis

```bash
# Rodar dashboard local (porta 3001)
cd apps/app && pnpm dev

# Rodar loja local (porta 3002)
cd apps/store && pnpm dev

# Rodar landing local (porta 3000)
cd apps/web && pnpm dev

# Build local
cd apps/app && npx next build
cd apps/store && npx next build

# Prisma Studio (ver banco)
cd packages/database && npx prisma studio

# Aplicar mudanças de schema
cd packages/database && npx prisma db push

# Criar migration formal
cd packages/database && npx prisma migrate dev --name <nome>

# Seed admin user
cd packages/database && npx tsx prisma/seed.ts

# Gerar client (roda automático no install)
cd packages/database && npx prisma generate
```

---

## 11. Arquivos-chave pra conhecer o projeto

- [packages/database/prisma/schema.prisma](packages/database/prisma/schema.prisma) — modelo de dados + índices
- [packages/database/prisma/seed.ts](packages/database/prisma/seed.ts) — seed do admin user
- [apps/app/auth.ts](apps/app/auth.ts) — NextAuth config + role propagation
- [apps/app/middleware.ts](apps/app/middleware.ts) — proteção de rotas
- [apps/app/lib/format.ts](apps/app/lib/format.ts) — helpers `brl`, `storeUrl`
- [apps/app/lib/order-status.ts](apps/app/lib/order-status.ts) — constantes de status
- [apps/app/app/(admin)/admin/layout.tsx](apps/app/app/(admin)/admin/layout.tsx) — guard de admin
- [apps/app/app/(dashboard)/dashboard/layout.tsx](apps/app/app/(dashboard)/dashboard/layout.tsx) — layout do lojista
- [apps/store/app/api/mercadopago/webhook/route.ts](apps/store/app/api/mercadopago/webhook/route.ts) — webhook com verificação HMAC
- [apps/store/app/api/customer/checkout/route.ts](apps/store/app/api/customer/checkout/route.ts) — checkout + criação de preferência MP
- [apps/store/app/[slug]/page.tsx](apps/store/app/[slug]/page.tsx) — home da loja pública

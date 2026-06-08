# Decisões de Arquitetura — Sharket Web (ADRs)

Frontend da plataforma Sharket. Angular workspace monorepo com 4 apps e bibliotecas compartilhadas.

---

## ADR-F001 — Repositório separado do backend

**Data:** 2026-06-08
**Status:** Aceito

**Contexto:** O backend Sharket é um monorepo Java/Maven com 9 serviços. O frontend usa Node.js/Angular — toolchains, runtimes e ciclos de deploy completamente diferentes. Um PR de hotfix no checkout não deve esperar a pipeline Java rodar, e vice-versa.

**Decisão:** Repositório `sharket-web` independente do repositório `sharket`. Os dois repositórios evoluem de forma autônoma com pipelines próprias.

**Consequências:**
- (+) CI do Angular não precisa clonar o monorepo Java e vice-versa
- (+) Times de front e back operam com autonomia — PRs, reviews e issues separados
- (+) Deploy do frontend não bloqueia e não é bloqueado pelo backend
- (-) Mudanças full-stack (ex.: novo campo de API + tela nova) exigem PRs em dois repositórios (mitigado com contratos de API documentados)

---

## ADR-F002 — Angular workspace monorepo com múltiplos apps

**Data:** 2026-06-08
**Status:** Aceito

**Contexto:** A plataforma tem 4 experiências distintas (vendedor, comprador, checkout, administração) que compartilham lógica de API, autenticação e design system. Criar 4 repositórios separados desde o início duplicaria código e dificultaria a manutenção de consistência.

**Decisão:** Um único workspace Angular (`angular.json`) com 4 projetos app e 4 projetos lib:

```
projects/
  seller/     ← Painel do Vendedor  — porta 4200
  buyer/      ← Portal do Comprador — porta 4201
  checkout/   ← Fluxo de Compra    — porta 4202
  admin/      ← Administração      — porta 4203
libs/
  ui/         ← Design System compartilhado
  api/        ← HTTP clients dos serviços backend
  auth/       ← Autenticação JWT compartilhada
  models/     ← Interfaces TypeScript (DTOs e modelos de domínio)
```

**Caminho de evolução para micro-frontends:** a estrutura atual respeita as fronteiras necessárias para Native Federation. Quando o time crescer e os apps precisarem de deploys verdadeiramente independentes, basta adicionar `federation.config.ts` por app sem reescrita (ver ADR-F011).

**Consequências:**
- (+) Um único `npm install` para todos os apps e libs
- (+) Libs compartilhadas sem overhead de publicação npm
- (+) Fronteiras claras entre apps — preparado para Module Federation
- (-) Build completo mais pesado que projetos isolados (mitigado com builds por app: `ng build seller`)

---

## ADR-F003 — Nomenclatura dos apps

**Data:** 2026-06-08
**Status:** Aceito

**Contexto:** Os apps legados tinham nomes técnicos sem semântica (`newDashboard`, `clientDashboard`). Nomes ruins aumentam a curva de onboarding, poluem o histórico git e complicam o roteamento entre times.

**Decisão:**

| App | Propósito | URL prevista | Porta dev |
|-----|-----------|--------------|-----------|
| `seller` | Painel do Vendedor / Produtor | `app.sharket.com` | 4200 |
| `buyer` | Portal do Comprador | `conta.sharket.com` | 4201 |
| `checkout` | Fluxo de Compra (público) | `pay.sharket.com` | 4202 |
| `admin` | Administração da plataforma | `admin.sharket.com` | 4203 |

**Consequências:**
- (+) Nomes descritivos que comunicam propósito sem contexto adicional
- (+) Escalável: novos apps (`affiliate`, `partner`) seguem o mesmo padrão
- (-) Renomear após o scaffolding tem custo de refatoração nos imports

---

## ADR-F004 — Bibliotecas compartilhadas no workspace

**Data:** 2026-06-08
**Status:** Aceito

**Contexto:** Lógica de autenticação, modelos de domínio e acesso à API são necessários em todos os apps. Sem libs compartilhadas, o código seria copiado entre os 4 projetos — qualquer mudança de endpoint exigiria 4 alterações.

**Decisão:** 4 libs no workspace, com dependências de framework explicitadas:

| Lib | Conteúdo | Dependência de framework |
|-----|----------|--------------------------|
| `models` | Interfaces TypeScript, enums, tipos de domínio | **Nenhuma** — TypeScript puro |
| `auth` | AuthService, guards, interceptors, decode de JWT | Angular (injetável) |
| `api` | HTTP clients de cada serviço backend | Angular HttpClient |
| `ui` | Componentes, directives, pipes compartilhados | Angular + Material |

A lib `models` é intencionalmente framework-agnostic — pode ser importada por projetos Ionic/Capacitor (mobile) sem adaptação. A lib `auth` expõe lógica de decode JWT como funções puras reutilizáveis em mobile.

**Consequências:**
- (+) Zero duplicação entre os 4 apps
- (+) Mudança de endpoint de API: alterar uma vez na lib `api`
- (+) `models` reutilizável em mobile sem alteração
- (-) Refatorações em libs afetam todos os apps (rodar `ng build` em todos após mudança de lib)

---

## ADR-F005 — Standalone Components como padrão

**Data:** 2026-06-08
**Status:** Aceito

**Contexto:** Angular 17+ usa standalone components por padrão, eliminando a necessidade de NgModules para a maioria dos casos. O modelo anterior adicionava boilerplate (`declarations`, `exports`) sem benefício real.

**Decisão:** Todos os componentes, pipes e directives são standalone. NgModules apenas onde bibliotecas de terceiros os exigirem explicitamente.

**Lazy loading:** feito por rota com `loadComponent()`, não por módulo.

**Consequências:**
- (+) Lazy loading granular por componente
- (+) Tree-shaking mais eficiente — bundle menor
- (+) Menos boilerplate, onboarding mais simples

---

## ADR-F006 — Estado gerenciado por Signals + Services

**Data:** 2026-06-08
**Status:** Aceito

**Contexto:** Opções disponíveis: NgRx (complexo, alto boilerplate, curva de aprendizado), Akita/NGXS (libs externas), ou Angular Signals nativos (Angular 16+).

**Decisão:** Angular Signals + Services como stores por feature. Cada feature tem seu próprio service com `signal()` e `computed()`. NgRx só entra se estado global com efeitos encadeados complexos se mostrar necessário — não é assumido de antemão.

```typescript
@Injectable({ providedIn: 'root' })
export class PedidosStore {
  readonly pedidos = signal<Pedido[]>([]);
  readonly carregando = signal(false);
  readonly total = computed(() => this.pedidos().length);

  carregarPedidos() {
    this.carregando.set(true);
    this.api.listarPedidos().subscribe(lista => {
      this.pedidos.set(lista);
      this.carregando.set(false);
    });
  }
}
```

**Consequências:**
- (+) Sem dependência extra além do Angular
- (+) Reativo por padrão, compatível com `async pipe` e `toObservable()`
- (+) Mais simples de testar (service puro)
- (-) Para fluxos com múltiplos efeitos encadeados e rollback (ex.: checkout em múltiplas etapas), NgRx Effects pode ser superior

---

## ADR-F007 — Angular Material como UI library

**Data:** 2026-06-08
**Status:** Aceito

**Contexto:** Necessidade de UI consistente entre os 4 apps sem custo de criar tudo do zero.

**Decisão:** Angular Material 19 como base do design system na lib `ui`. Customização via `@use '@angular/material'` com paleta de cores da marca Sharket definida em `_theme.scss` centralizado.

**Consequências:**
- (+) Componentes acessíveis (WAI-ARIA) sem esforço adicional
- (+) Theming centralizado: mudar a paleta reflete em todos os apps automaticamente
- (+) Integração nativa com Angular — mesmos releases, sem conflitos de versão
- (-) Personalização visual além do theming requer override de CSS específico do Material

---

## ADR-F008 — JWT armazenado em localStorage (MVP) — plano de migração documentado

**Data:** 2026-06-08
**Status:** Aceito / A revisar após API Gateway

**Contexto:** Opções: `localStorage` (simples, risco XSS), `httpOnly cookie` (seguro, requer proxy/backend para refresh), `sessionStorage` (não persiste entre abas).

**Decisão:** `localStorage` para o MVP com as seguintes mitigações:
- Content Security Policy configurada no nginx de cada app
- Token com TTL curto (1 hora)
- Nenhum dado sensível além do token no `localStorage`

**Plano de migração:** quando o API Gateway for implementado (ADR pendente no backend), ele assumirá o `set-cookie` com `HttpOnly` + `Secure` + `SameSite=Strict` no login. O Angular parará de lidar com o token diretamente — apenas enviará as requisições e o cookie será anexado automaticamente pelo browser.

**Consequências:**
- (+) Implementação simples no MVP
- (-) Token acessível via JavaScript — risco se XSS ocorrer (mitigado por CSP)

---

## ADR-F009 — Docker multi-stage + nginx para produção

**Data:** 2026-06-08
**Status:** Aceito

**Contexto:** Cada app Angular é uma SPA estática após o build. Precisa de servidor HTTP para servir arquivos e lidar com rotas client-side (fallback para `index.html`).

**Decisão:** Dockerfile multi-stage por app:
- Stage `build`: `node:20-alpine` + `npm ci` + `ng build <app> --configuration production`
- Stage `serve`: `nginx:alpine` + cópia do `dist/`

O `nginx.conf` de cada app configura:
- `try_files $uri $uri/ /index.html` para suporte a rotas Angular
- Headers de segurança: `Content-Security-Policy`, `X-Frame-Options`, `Strict-Transport-Security`
- Cache de assets com hash (`main.<hash>.js` → `max-age=1year`)

Desenvolvimento local: `ng serve <app>` sem Docker (hot reload imediato, sem latência de volume mount no Windows).

**Consequências:**
- (+) Imagens de produção mínimas (~25-40MB por app)
- (+) Mesmo padrão de infra do backend
- (+) `ng serve` local sem latência de Docker/volume mount no Windows

---

## ADR-F010 — Pipelines GitHub Actions

**Data:** 2026-06-08
**Status:** Aceito

**Contexto:** Necessidade de CI/CD automatizado no repositório `sharket-web`.

**Decisão:**

| Workflow | Trigger | Jobs |
|----------|---------|------|
| `ci.yml` | Push em qualquer branch / PR para `main` | lint → test → build (jobs paralelos por app) |
| `deploy.yml` | Push em `main` | build Docker → push registry → deploy |

**Estratégia de paralelismo no CI:**
```yaml
strategy:
  matrix:
    app: [seller, buyer, checkout, admin]
```
Cada app compila em paralelo — tempo total = tempo do app mais lento, não a soma.

**Consequências:**
- (+) Feedback rápido em PRs (~3-5min com paralelismo)
- (+) Deploy automático após merge em `main`
- (-) No MVP, todos os apps sobem juntos no deploy — path filters por app podem ser adicionados quando ciclos de deploy divergirem

---

## ADR-F011 — Preparação para micro-frontends via Native Federation

**Data:** 2026-06-08
**Status:** Aceito / Implementação futura

**Contexto:** O time pode crescer e demandar deploys verdadeiramente independentes — `seller` no ar com nova feature enquanto `buyer` está em hotfix crítico sem interferência.

**Decisão:** A estrutura atual do workspace **já respeita as fronteiras necessárias**:
- Cada app é uma unidade deployável independente (build separado, nginx separado)
- Nenhum app importa diretamente de outro app (apenas de libs compartilhadas)
- Libs compiladas separadamente

**Passo de migração:** adicionar `@angular-architects/native-federation` + `federation.config.ts` por app quando necessário. Sem reescrita de código existente.

```
Hoje:         1 build CI → 4 imagens Docker → deploy em conjunto
Micro-frontend: 4 builds independentes → 4 deploys independentes → shell host compõe UIs
```

**Consequências:**
- (+) Migração sem reescrita — apenas adição de configuração
- (-) Requer disciplina contínua: apps nunca importam diretamente uns dos outros

---

## ADR-F012 — Caminho de evolução para mobile

**Data:** 2026-06-08
**Status:** Aceito / Implementação futura

**Contexto:** A plataforma pode precisar de apps móveis nativos (Android/iOS). Reescrever toda a lógica de negócio do zero para mobile seria custoso.

**Decisão:** Libs `models` e `auth` (lógica de decode JWT) são framework-agnostic por design. Um projeto Ionic/Capacitor pode importar essas libs diretamente:

```
Caminho 1 (curto prazo):
  Ionic + Angular → importa models, auth e api do mesmo workspace

Caminho 2 (longo prazo):
  React Native → extrair models para pacote npm puro independente
```

**Regra para manter compatibilidade:** libs `models` e `auth` (core) não podem ter dependências de `window`, `document` ou qualquer API de DOM.

**Consequências:**
- (+) Investimento nas libs tem retorno duplo: web e mobile
- (-) Requer disciplina nas libs para evitar dependências de DOM

---

## Controle de versão

**Versionamento unificado do workspace.** Uma versão semântica para o workspace inteiro (ex.: `v1.2.0`). Todos os apps evoluem juntos enquanto o time for pequeno.

Tags git:
```
v1.0.0  ← release inicial
v1.1.0  ← nova feature (qualquer app)
v1.1.1  ← hotfix
```

Quando apps tiverem ciclos de deploy independentes, migrar para versionamento por app:
```
seller/v1.2.0
buyer/v1.0.3
checkout/v2.1.0
```

---

## Próximas decisões pendentes

- [ ] ADR-F013 — Internacionalização (i18n): Angular i18n nativo vs ngx-translate
- [ ] ADR-F014 — Testes E2E: Cypress vs Playwright
- [ ] ADR-F015 — API Gateway e migração do JWT para httpOnly cookies
- [ ] ADR-F016 — Progressive Web App (PWA): manifesto + service worker
- [ ] ADR-F017 — Estratégia de testes de acessibilidade (WCAG 2.1 AA)

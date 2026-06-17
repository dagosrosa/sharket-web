# Sharket Web

Frontend da plataforma Sharket. Angular workspace monorepo com 4 apps independentes e bibliotecas compartilhadas.

Repositório do backend: [`sharket`](https://github.com/dagosrosa/sharket)

---

## Apps

| App | Propósito | Porta dev | URL produção |
|-----|-----------|-----------|--------------|
| `seller` | Painel do Vendedor / Produtor | 4200 | `app.sharket.com` |
| `buyer` | Portal do Comprador | 4201 | `conta.sharket.com` |
| `checkout` | Fluxo de Compra (público) | 4202 | `pay.sharket.com` |
| `admin` | Administração da plataforma | 4203 | `admin.sharket.com` |

---

## Estrutura do repositório

```
projects/
  seller/       ← Painel do Vendedor
  buyer/        ← Portal do Comprador
  checkout/     ← Fluxo de Compra
  admin/        ← Administração Sharket
libs/
  ui/           ← Design system + componentes compartilhados (Angular Material)
  api/          ← HTTP clients para os serviços backend
  auth/         ← Autenticação JWT compartilhada (guards, interceptors)
  models/       ← Interfaces TypeScript (DTOs e modelos de domínio — framework-agnostic)
infra/
  nginx/        ← Configurações nginx por app
  docker/       ← Dockerfiles multi-stage por app
.github/
  workflows/
    ci.yml      ← Lint + test + build em PRs
    deploy.yml  ← Build Docker + deploy em push para main
docker-compose.prod.yml
```

---

## Stack

| Camada | Tecnologia |
|--------|------------|
| Framework | Angular 22 |
| UI | Angular Material 22 |
| Estado | Angular Signals + Services |
| HTTP | HttpClient + interceptors |
| Autenticação | JWT (via iam-service do backend) |
| Estilo | SCSS + Angular Material theming |
| Testes unitários | Jest + Angular Testing Library |
| Testes E2E | A definir — ver ADR-F014 |
| Produção | Docker multi-stage + nginx |
| CI/CD | GitHub Actions |

---

## Pré-requisitos

- Node.js 22.22.3+ (use `.nvmrc` com NVM: `nvm use`)
- Angular CLI 22+: `npm install -g @angular/cli@22`
- Backend Sharket rodando localmente (ver repositório `sharket`)

---

## Subindo localmente

```bash
# Instalar dependências
npm install

# Painel do Vendedor
ng serve seller

# Portal do Comprador
ng serve buyer

# Fluxo de Compra
ng serve checkout

# Administração
ng serve admin
```

Os apps apontam para o backend em `http://localhost:808x` por padrão (configurável em `environments/`).

---

## Build de produção

```bash
# App individual
ng build seller --configuration production

# Todos os apps
npm run build:all
```

---

## Deploy em produção — Azure Static Web Apps (ambiente ativo)

O deploy é automatizado via GitHub Actions a cada push em `master` (`.github/workflows/deploy.yml`).

### Fluxo do pipeline

1. **Build** (paralelo, 4 apps) — `ng build <app> --configuration production` → artifact `dist/<app>/browser`
2. **Deploy** (4 jobs independentes) — `Azure/static-web-apps-deploy@v1` com token por app

### URLs de staging

| App | URL atual (staging) | Custom domain (pendente DNS) |
|-----|--------------------|-----------------------------|
| `seller` | `https://ambitious-glacier-019f93f0f.7.azurestaticapps.net` | `app.sharket.com.br` |
| `buyer` | `https://nice-dune-020663d0f.7.azurestaticapps.net` | `conta.sharket.com.br` |
| `checkout` | `https://lively-sea-0cef2f10f.7.azurestaticapps.net` | `pay.sharket.com.br` |
| `admin` | `https://yellow-island-080d01d0f.7.azurestaticapps.net` | `admin.sharket.com.br` |

### Ambiente de produção (`environment.prod.ts`)

Todos os 4 apps apontam para o gateway:
```
GATEWAY = https://gateway-service.yellowmushroom-6c4bca83.brazilsouth.azurecontainerapps.io
```
Após configurar `api.sharket.com.br`, atualizar para `https://api.sharket.com.br` e fazer push.

### Secrets necessários no GitHub (`dagosrosa/sharket-web`)

| Secret | App |
|--------|-----|
| `SWA_TOKEN_SELLER` | swa-sharket-seller |
| `SWA_TOKEN_BUYER` | swa-sharket-buyer |
| `SWA_TOKEN_CHECKOUT` | swa-sharket-checkout |
| `SWA_TOKEN_ADMIN` | swa-sharket-admin |

### Vincular custom domains (após DNS propagar)

```powershell
$env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH","User")

az staticwebapp hostname set --name swa-sharket-seller `
  --resource-group rg-sharket --hostname app.sharket.com.br

az staticwebapp hostname set --name swa-sharket-buyer `
  --resource-group rg-sharket --hostname conta.sharket.com.br

az staticwebapp hostname set --name swa-sharket-checkout `
  --resource-group rg-sharket --hostname pay.sharket.com.br

az staticwebapp hostname set --name swa-sharket-admin `
  --resource-group rg-sharket --hostname admin.sharket.com.br
```

SSL é provisionado automaticamente pelo Azure após vinculação.

---

## Docker (uso local / desenvolvimento)

```bash
# Build e start de todos os apps
docker-compose -f docker-compose.prod.yml up -d --build

# App individual
docker build -f infra/docker/Dockerfile.seller -t sharket/seller:latest .
```

> **SSL/TLS obrigatório se usar nginx local.** O nginx de cada app espera certificados em `/etc/nginx/ssl/fullchain.pem` e `privkey.pem`. O `docker-compose.prod.yml` monta os certs do Let's Encrypt automaticamente. Para obtê-los:
>
> ```bash
> certbot certonly --standalone \
>   -d app.sharket.com.br -d conta.sharket.com.br \
>   -d pay.sharket.com.br -d admin.sharket.com.br
> ```

---

## Testes

```bash
# Unitários
ng test seller
ng test buyer

# Todos
npm run test:all
```

---

## Convenções de commit

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/) com scope por módulo:

```
<tipo>(<scope>): <descrição em português>
```

**Tipos:**

| Tipo | Quando usar |
|------|-------------|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `refactor` | Refatoração sem mudança de comportamento |
| `test` | Adição ou correção de testes |
| `chore` | Manutenção, dependências, configuração |
| `docs` | Documentação |
| `ci` | Pipeline e GitHub Actions |
| `style` | Ajustes de estilo, formatação (sem lógica) |

**Scopes:**

| Scope | O que abrange |
|-------|---------------|
| `seller` | App painel do vendedor |
| `buyer` | App portal do comprador |
| `checkout` | App fluxo de compra |
| `admin` | App administração |
| `ui` | Lib design system compartilhado |
| `api` | Lib HTTP clients do backend |
| `auth` | Lib autenticação compartilhada |
| `models` | Lib interfaces TypeScript |
| `web` | Workspace (angular.json, package.json, tsconfig) |
| `infra` | Docker, nginx |
| `ci` | GitHub Actions workflows |

**Regra:** um scope por commit — nunca misturar dois apps no mesmo commit.

**Exemplos corretos:**

```
feat(seller): implementar listagem de pedidos com paginação
fix(checkout): corrigir cálculo de frete no resumo do pedido
refactor(auth): extrair decode de JWT para função pura na lib models
test(seller): adicionar testes unitários para PedidosStore
chore(web): upgrade Angular 22, Node 22.22.3
chore(infra): configurar headers CSP no nginx do checkout
ci: adicionar job de lint no workflow de CI
```

**Antipadrões:**

```
# ERRADO: dois apps no mesmo commit
feat(seller,buyer): adicionar tela de perfil do usuário

# ERRADO: scope de app para mudança de workspace
feat(seller): atualizar package.json raiz

# ERRADO: scope infra para mudança de app
chore(infra): corrigir rota de autenticação no seller
```

---

## Governança

Decisões arquiteturais: [ARCHITECTURE.md](ARCHITECTURE.md)

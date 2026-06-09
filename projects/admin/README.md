# admin — Administração da Plataforma

App Angular para operadores internos gerenciarem planos, feature flags e aplicativos OAuth.

**URL produção:** `admin.sharket.com` | **Porta dev:** `4203`

## Funcionalidades planejadas

| Feature | Rota | Descrição |
|---------|------|-----------|
| Login | `/login` | Autenticação restrita (perfil MASTER/ADMIN) |
| Dashboard | `/app/dashboard` | Métricas globais da plataforma |
| Planos | `/app/planos` | CRUD de planos de taxas (taxaPercentual + taxaFixa) |
| Feature Flags | `/app/feature-flags` | Ativar/desativar funcionalidades por conta |
| OAuth Apps | `/app/oauth` | Aplicativos OAuth registrados (clientId/clientSecret) |
| Contas | `/app/contas` | Visão geral de contas ativas |

## Segurança

- **Autenticação obrigatória** com perfil `MASTER` ou `ADMIN`
- **CSP restrita** — nginx com `X-Frame-Options: DENY`
- Guard adicional verificando perfil além de autenticação

## Desenvolvimento

```bash
# na raiz do workspace (C:\KINGFY\web)
$env:PATH = "C:\Users\dagos.rosa\AppData\Roaming\nvm\v22.22.3;$env:PATH"
ng serve admin --port=4203
```

## Build de produção

```bash
ng build admin --configuration production
# artefatos em dist/admin/browser/
```

## Docker

```bash
docker build -f infra/docker/Dockerfile.admin -t sharket/admin .
docker run -p 4203:80 sharket/admin
```

## Dependências de libs

- `models` — interfaces de domínio
- `auth` — `AuthService`, `authGuard`, `jwtInterceptor`
- `api` — services de todos os microsserviços (visão consolidada)
- `platform-service` (backend porta 8088) — planos, feature flags, OAuth apps

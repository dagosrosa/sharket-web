# admin — Administração da Plataforma

App Angular para operadores internos gerenciarem planos, feature flags e aplicativos OAuth.

**URL produção:** `admin.sharket.com` | **Porta dev:** `4203`

---

## Funcionalidades

| Feature | Rota | Descrição |
|---------|------|-----------|
| Login | `/login` | Autenticação restrita a perfil `MASTER` ou `ADMIN` |
| Dashboard | `/app/dashboard` | Contagem de planos, feature flags e OAuth Apps ativos |
| Planos | `/app/planos` | CRUD de planos de taxas (`taxaPercentual` + `taxaFixa`) |
| Feature Flags | `/app/feature-flags` | Criar flags e ativar/desativar individualmente |
| OAuth Apps | `/app/oauth` | Registrar apps OAuth com `nome` + `contaId`, exibe `clientSecret` uma vez |

---

## Segurança

- **`adminGuard`** — verifica autenticação E perfil (`MASTER` ou `ADMIN`); rejeita `VENDEDOR`/`SUPORTE` com redirect para `/login`
- Login valida o perfil no frontend antes de salvar sessão — usuário com perfil inválido recebe erro imediato
- `jwtInterceptor` injeta `Authorization: Bearer` em todas as requisições

---

## Desenvolvimento

```bash
# na raiz do workspace (C:\SHARKET\web)
$env:PATH = "C:\Users\dagos.rosa\AppData\Roaming\nvm\v22.22.3;$env:PATH"
ng serve admin --port=4203
```

---

## Build de produção

```bash
ng build admin --configuration production
# artefatos em dist/admin/browser/
# production usa environment.prod.ts → https://api.sharket.com (gateway)
```

---

## Docker

```bash
docker build -f infra/docker/Dockerfile.admin -t sharket/admin .
docker run -p 4203:80 sharket/admin
```

---

## Dependências de libs

- `models` — `Plano`, `FeatureFlag`, `AplicativoOAuth`, `Usuario`, `ApiResponse`, `Page`
- `auth` — `AuthService`, `jwtInterceptor`; `adminGuard` é local em `src/app/guards/`
- `api` — `IamService` (login), `PlatformService` (planos, flags, OAuth)
- Environments: `environment.ts` (dev) / `environment.prod.ts` (prod, gateway)

---

## `PlatformService`

Conecta ao `platform-service` (porta 8088). A URL é derivada do hostname de `iamUrl` + porta 8088 (não há campo separado em `SHARKET_API_CONFIG`). Expõe:

- `listarPlanos()`, `criarPlano(req)` — gerenciamento de planos de taxas
- `listarFlags()`, `criarFlag(req)`, `toggleFlag(id)` — feature flags
- `listarApps()`, `registrarApp(req)` — OAuth Apps

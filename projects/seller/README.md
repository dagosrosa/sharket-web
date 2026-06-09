# seller — Painel do Vendedor

App Angular para produtores e vendedores gerenciarem sua operação na plataforma.

**URL produção:** `app.sharket.com` | **Porta dev:** `4200`

## Funcionalidades

| Feature | Rota | Descrição |
|---------|------|-----------|
| Login | `/login` | Autenticação com email e senha |
| Dashboard | `/app/dashboard` | Saldo disponível e a liberar |
| Produtos | `/app/produtos` | Listagem do catálogo de produtos |
| Pedidos | `/app/pedidos` | Pedidos recebidos na conta |
| Financeiro | `/app/financeiro` | Saldo, lançamentos e saques |
| Assinaturas | `/app/assinaturas` | Assinantes ativos e histórico |

## Desenvolvimento

```bash
# na raiz do workspace (C:\KINGFY\web)
$env:PATH = "C:\Users\dagos.rosa\AppData\Roaming\nvm\v22.22.3;$env:PATH"
ng serve seller --port=4200
```

## Build de produção

```bash
ng build seller --configuration production
# artefatos em dist/seller/browser/
```

## Docker

```bash
docker build -f infra/docker/Dockerfile.seller -t sharket/seller .
docker run -p 4200:80 sharket/seller
```

## Dependências de libs

- `models` — interfaces de domínio
- `auth` — `AuthService`, `authGuard`, `jwtInterceptor`
- `api` — `IamService`, `CatalogService`, `CommerceService`, `FinancialService`, `SubscriptionService`

## Estrutura de rotas

```
/login                  → LoginComponent (público)
/app                    → ShellComponent (protegido por authGuard)
  /dashboard            → DashboardComponent
  /produtos             → ProdutosComponent
  /pedidos              → PedidosComponent
  /financeiro           → FinanceiroComponent
  /assinaturas          → AssinaturasComponent
```

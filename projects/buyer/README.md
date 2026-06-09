# buyer — Portal do Comprador

App Angular para compradores acompanharem pedidos e gerenciarem assinaturas.

**URL produção:** `conta.sharket.com` | **Porta dev:** `4201`

## Funcionalidades

| Feature | Rota | Descrição |
|---------|------|-----------|
| Login | `/login` | Autenticação com email e senha |
| Dashboard | `/app/dashboard` | Total de pedidos e assinaturas ativas |
| Meus Pedidos | `/app/pedidos` | Lista de pedidos com status |
| Detalhe do Pedido | `/app/pedidos/:id` | Itens, subtotais e status detalhado |
| Minhas Assinaturas | `/app/assinaturas` | Assinaturas ativas com opção de cancelar |
| Meu Perfil | `/app/perfil` | Dados da conta e logout |

## Desenvolvimento

```bash
# na raiz do workspace (C:\SHARKET\web)
$env:PATH = "C:\Users\dagos.rosa\AppData\Roaming\nvm\v22.22.3;$env:PATH"
ng serve buyer --port=4201
```

## Build de produção

```bash
ng build buyer --configuration production
# artefatos em dist/buyer/browser/
```

## Docker

```bash
docker build -f infra/docker/Dockerfile.buyer -t sharket/buyer .
docker run -p 4201:80 sharket/buyer
```

## Dependências de libs

- `models` — interfaces de domínio
- `auth` — `AuthService`, `authGuard`, `jwtInterceptor`
- `api` — `IamService`, `CommerceService`, `SubscriptionService`

## Estrutura de rotas

```
/login                  → LoginComponent (público)
/app                    → ShellComponent (protegido por authGuard)
  /dashboard            → DashboardComponent
  /pedidos              → PedidosComponent
  /pedidos/:id          → PedidoDetalheComponent
  /assinaturas          → AssinaturasComponent
  /perfil               → PerfilComponent
```

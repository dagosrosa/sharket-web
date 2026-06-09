# checkout — Fluxo de Compra

App Angular público para o fluxo de pagamento. Acessado pelo link de venda do produtor — não requer login prévio do comprador.

**URL produção:** `pay.sharket.com` | **Porta dev:** `4202`

---

## Funcionalidades

| Feature | Rota | Descrição |
|---------|------|-----------|
| Página do produto | `/loja/:contaId/:produtoId` | Produto com descrição, preço e CTA "Comprar agora" |
| Checkout (3 etapas) | `/checkout/:contaId/:produtoId` | MatStepper: dados pessoais → forma de pagamento → confirmação |
| Sucesso | `/sucesso` | Confirmação com dados do pedido e método escolhido |
| Erro | `/erro` | Pagamento recusado, botão para tentar novamente |

---

## Arquitetura

- **Público** — sem `jwtInterceptor`, sem `authGuard`
- **`CheckoutStateService`** — estado compartilhado entre rotas via Angular Signals (`produto`, `contaId`, `dadosComprador`, `metodoPagamento`)
- **Formas de pagamento:** PIX (aprovação imediata), Boleto (3 dias úteis), Cartão de crédito (com campos condicionais)
- **`contaId`** do vendedor embutido na URL — o checkout sabe de qual conta está vendendo

---

## Desenvolvimento

```bash
# na raiz do workspace (C:\SHARKET\web)
$env:PATH = "C:\Users\dagos.rosa\AppData\Roaming\nvm\v22.22.3;$env:PATH"
ng serve checkout --port=4202
```

Acesse: `http://localhost:4202/loja/{contaId}/{produtoId}`

---

## Build de produção

```bash
ng build checkout --configuration production
# artefatos em dist/checkout/browser/
# production usa environment.prod.ts → https://api.sharket.com (gateway)
```

---

## Docker

```bash
docker build -f infra/docker/Dockerfile.checkout -t sharket/checkout .
docker run -p 4202:80 sharket/checkout
```

---

## Dependências de libs

- `models` — `Produto`, `ApiResponse`, `Page`
- `api` — `CatalogService` (carregar produto), `SHARKET_API_CONFIG`
- Environments: `environment.ts` (dev, portas individuais) / `environment.prod.ts` (prod, gateway)

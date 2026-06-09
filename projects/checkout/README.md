# checkout — Fluxo de Compra

App Angular público para o fluxo de pagamento. Acessado pelo link de venda do produtor — não requer login prévio do comprador.

**URL produção:** `pay.sharket.com` | **Porta dev:** `4202`

## Funcionalidades planejadas

| Feature | Rota | Descrição |
|---------|------|-----------|
| Página do produto | `/:produtoId` | Apresentação do produto com CTA de compra |
| Dados pessoais | `/:produtoId/dados` | Nome, email, CPF do comprador |
| Pagamento | `/:produtoId/pagamento` | Cartão de crédito, PIX ou boleto |
| Confirmação | `/:produtoId/confirmacao` | Resumo e confirmação do pedido |
| Sucesso | `/sucesso` | Pedido confirmado, instruções de acesso |
| Erro | `/erro` | Pagamento recusado, opções de retry |

## Características especiais

- **Público** — não exige autenticação do comprador
- **Otimizado para conversão** — sem distrações, foco no funil
- **CSP restrita** — nginx com `X-Frame-Options: DENY` (não pode ser iframeado)
- **Sem sidenav** — layout linear passo a passo

## Desenvolvimento

```bash
# na raiz do workspace (C:\KINGFY\web)
$env:PATH = "C:\Users\dagos.rosa\AppData\Roaming\nvm\v22.22.3;$env:PATH"
ng serve checkout --port=4202
```

## Build de produção

```bash
ng build checkout --configuration production
# artefatos em dist/checkout/browser/
```

## Docker

```bash
docker build -f infra/docker/Dockerfile.checkout -t sharket/checkout .
docker run -p 4202:80 sharket/checkout
```

## Dependências de libs

- `models` — interfaces de domínio
- `api` — `CatalogService` (produto), `IamService` (criar conta buyer no checkout)

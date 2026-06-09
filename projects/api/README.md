# @sharket/api

Clientes HTTP para os serviços backend. Cada service encapsula as chamadas de um microsserviço.

## Serviços

| Service | Microsserviço | Porta dev | Prefixo de path |
|---------|--------------|-----------|-----------------|
| `IamService` | iam-service | 8080 | `/api/v1/auth` |
| `CatalogService` | catalog-service | 8081 | `/api/v1/produtos` |
| `CommerceService` | commerce-service | 8082 | `/api/v1/pedidos` |
| `FinancialService` | financial-service | 8085 | `/api/v1/financeiro` |
| `SubscriptionService` | subscription-service | 8084 | `/api/v1/assinaturas` |
| `PlatformService` | platform-service | 8088 | `/api/v1/planos`, `/api/v1/feature-flags`, `/api/v1/oauth` |

## Configuração de URLs

As URLs são configuradas via `SHARKET_API_CONFIG` (InjectionToken). O valor é provido no `app.config.ts` de cada app usando o `environment` Angular:

```typescript
// app.config.ts
import { environment } from '../environments/environment';

providers: [
  { provide: SHARKET_API_CONFIG, useValue: environment.api },
]
```

**Dev** (`environment.ts`) — portas individuais por serviço:
```typescript
api: {
  iamUrl: 'http://localhost:8080',
  catalogUrl: 'http://localhost:8081',
  commerceUrl: 'http://localhost:8082',
  financialUrl: 'http://localhost:8085',
  subscriptionUrl: 'http://localhost:8084',
}
```

**Prod** (`environment.prod.ts`) — tudo via API Gateway:
```typescript
api: {
  iamUrl: 'https://api.sharket.com',
  catalogUrl: 'https://api.sharket.com',
  commerceUrl: 'https://api.sharket.com',
  financialUrl: 'https://api.sharket.com',
  subscriptionUrl: 'https://api.sharket.com',
}
```

O `gateway-service` (porta 8000 em dev, `api.sharket.com` em prod) roteia pelos paths.

## Autenticação

O `jwtInterceptor` da lib `auth` injeta o header `Authorization: Bearer <token>` automaticamente em todas as requisições. O header `X-Conta-Id` é passado explicitamente em cada chamada que o exige.

## `PlatformService` — URL especial

`PlatformService` não tem campo próprio em `SHARKET_API_CONFIG`. A URL é derivada do hostname de `iamUrl` com porta 8088:

```typescript
private base = () => {
  const host = new URL(this.config.iamUrl).hostname;
  return `http://${host}:8088/api/v1`;
};
```

Em produção, se `iamUrl = 'https://api.sharket.com'`, o gateway na porta 443 roteia `/api/v1/planos/**` → platform-service. O `PlatformService` usa simplesmente `config.iamUrl` como base URL na produção (sem porta explícita).

## Uso

```typescript
import { CatalogService } from 'api';

export class ProdutosComponent {
  private catalog = inject(CatalogService);

  ngOnInit() {
    this.catalog.listar(contaId).subscribe(res => {
      // res.data.content → Produto[]
      // res.data.totalElements → number
    });
  }
}
```

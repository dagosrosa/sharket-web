# @sharket/api

Clientes HTTP para os serviços backend. Cada service encapsula as chamadas de um microsserviço.

## Serviços

| Service | Microsserviço | Porta dev |
|---------|--------------|-----------|
| `IamService` | iam-service | 8080 |
| `CatalogService` | catalog-service | 8081 |
| `CommerceService` | commerce-service | 8082 |
| `FinancialService` | financial-service | 8085 |
| `SubscriptionService` | subscription-service | 8084 |

## Configuração de URLs

As URLs são configuradas via `SHARKET_API_CONFIG` (InjectionToken). O valor padrão aponta para `localhost` em desenvolvimento:

```typescript
// padrão (desenvolvimento)
{
  iamUrl: 'http://localhost:8080',
  catalogUrl: 'http://localhost:8081',
  commerceUrl: 'http://localhost:8082',
  financialUrl: 'http://localhost:8085',
  subscriptionUrl: 'http://localhost:8084',
}
```

Para sobrescrever (ex: staging), forneça no `app.config.ts`:

```typescript
import { SHARKET_API_CONFIG } from 'api';

providers: [
  {
    provide: SHARKET_API_CONFIG,
    useValue: {
      iamUrl: 'https://api.sharket.com',
      // ...
    },
  },
]
```

## Autenticação

O `jwtInterceptor` da lib `auth` injeta o header `Authorization: Bearer <token>` automaticamente em todas as requisições. O header `X-Conta-Id` é passado explicitamente em cada chamada que o exige.

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

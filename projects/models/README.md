# @sharket/models

Interfaces TypeScript compartilhadas entre todos os apps do workspace. Não tem dependência de Angular — pode ser importada por qualquer contexto (Angular, Node, testes).

## Conteúdo

| Arquivo | Exports |
|---------|---------|
| `api-response.model.ts` | `ApiResponse<T>`, `Page<T>` |
| `usuario.model.ts` | `Usuario`, `Perfil`, `LoginRequest`, `LoginResponse` |
| `produto.model.ts` | `Produto`, `CriarProdutoRequest` |
| `pedido.model.ts` | `Pedido`, `ItemPedido`, `StatusPedido` |
| `financeiro.model.ts` | `Saldo`, `Lancamento`, `Saque`, `TipoLancamento`, `StatusSaque`, `SolicitarSaqueRequest` |
| `assinatura.model.ts` | `Assinatura`, `Periodicidade`, `StatusAssinatura` |

## Uso

```typescript
import { Produto, ApiResponse, Page } from 'models';
```

> O path `models` está mapeado para `projects/models/src/public-api` no `tsconfig.json` raiz — nenhum build prévio necessário.

## Convenção

- Interfaces espelham os contratos de resposta dos serviços backend Java
- Nenhuma lógica — apenas tipos
- Campos de data são `string` (ISO 8601) — conversão fica na camada de apresentação

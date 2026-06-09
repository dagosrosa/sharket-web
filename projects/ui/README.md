# @sharket/ui

Design system e componentes Angular Material compartilhados entre os apps.

## Status

Biblioteca criada e mapeada no workspace. Componentes serão extraídos dos apps conforme padrões se consolidam.

## Uso

```typescript
import { /* ComponenteX */ } from 'ui';
```

## Componentes planejados

| Componente | Descrição |
|-----------|-----------|
| `StatusChipComponent` | Chip com cor semântica por status (PAGO → verde, CANCELADO → vermelho) |
| `EmptyStateComponent` | Estado vazio padronizado com ícone e mensagem configurável |
| `ConfirmDialogComponent` | Dialog de confirmação reutilizável (substituir `confirm()` nativo) |
| `PageHeaderComponent` | Cabeçalho de página com título, breadcrumb e ação primária |
| `PaginatorComponent` | Paginação integrada com `Page<T>` do backend |

## Tema

Angular Material M3 com paleta violeta (`mat.$violet-palette`). Configurado em `styles.scss` de cada app via `mat.theme()`. As variáveis CSS do sistema Material (`--mat-sys-*`) ficam disponíveis globalmente em todos os componentes.

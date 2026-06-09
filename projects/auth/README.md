# @sharket/auth

Biblioteca de autenticação compartilhada entre todos os apps. Gerencia sessão JWT via Angular Signals e localStorage.

## Exports

| Símbolo | Tipo | Descrição |
|---------|------|-----------|
| `AuthService` | Service | Sessão do usuário (token + user como Signals) |
| `authGuard` | `CanActivateFn` | Bloqueia rotas não autenticadas, redireciona para `/login` |
| `jwtInterceptor` | `HttpInterceptorFn` | Injeta `Authorization: Bearer <token>` em todas as requisições |

## Uso

### Registrar no app

```typescript
// app.config.ts
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from 'auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([jwtInterceptor])),
  ],
};
```

### Proteger rotas

```typescript
// app.routes.ts
import { authGuard } from 'auth';

{ path: 'app', canActivate: [authGuard], ... }
```

### Usar no componente

```typescript
import { AuthService } from 'auth';

export class ShellComponent {
  auth = inject(AuthService);
  // auth.user()            → Usuario | null (Signal)
  // auth.isAuthenticated() → boolean (computed Signal)
  // auth.token()           → string | null (Signal)
  // auth.logout()          → limpa sessão e navega para /login
}
```

## Armazenamento

| Chave | Conteúdo |
|-------|----------|
| `sharket_token` | JWT string |
| `sharket_user` | JSON do objeto `Usuario` |

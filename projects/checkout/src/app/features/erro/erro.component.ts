import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common';

@Component({
  selector: 'app-erro',
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="page">
      <div class="brand">Sharket</div>

      <div class="error-box">
        <mat-icon class="icon">error_outline</mat-icon>
        <h1>Algo deu errado</h1>
        <p>Não foi possível processar sua compra. Verifique os dados e tente novamente.</p>
        <button mat-flat-button (click)="voltar()">Tentar novamente</button>
      </div>
    </div>
  `,
  styles: [`
    .page { display: flex; flex-direction: column; align-items: center; min-height: 100vh; padding: 40px 16px; background: var(--mat-sys-surface-container-low); }
    .brand { font-size: 1.5rem; font-weight: 700; color: var(--mat-sys-primary); margin-bottom: 40px; }
    .error-box { text-align: center; max-width: 480px; }
    .icon { font-size: 72px; width: 72px; height: 72px; color: var(--mat-sys-error); }
    h1 { margin: 16px 0 24px; }
    p { margin: 0 0 24px; color: var(--mat-sys-on-surface-variant); }
  `],
})
export class ErroComponent {
  private location = inject(Location);
  voltar(): void { this.location.back(); }
}

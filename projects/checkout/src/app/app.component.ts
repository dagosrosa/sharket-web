import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CheckoutStateService } from './services/checkout-state.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {
  private state = inject(CheckoutStateService);

  constructor() {
    effect(() => {
      const b = this.state.branding();
      const root = document.documentElement.style;
      if (b?.corPrimaria) {
        root.setProperty('--mat-sys-primary', b.corPrimaria);
        root.setProperty('--mat-sys-on-primary', '#ffffff');
      } else {
        root.removeProperty('--mat-sys-primary');
        root.removeProperty('--mat-sys-on-primary');
      }
    });
  }
}

import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from 'auth';

interface NavItem {
  icon: string;
  label: string;
  route: string;
}

const NAV: NavItem[] = [
  { icon: 'dashboard', label: 'Dashboard', route: '/app/dashboard' },
  { icon: 'sell', label: 'Planos', route: '/app/planos' },
  { icon: 'toggle_on', label: 'Feature Flags', route: '/app/feature-flags' },
  { icon: 'apps', label: 'OAuth Apps', route: '/app/oauth' },
];

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatSidenavModule, MatToolbarModule, MatListModule, MatIconModule, MatButtonModule],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private bp = inject(BreakpointObserver);

  nav = NAV;
  isHandset = signal(false);
  sidenavOpen = signal(true);

  constructor() {
    this.bp.observe(Breakpoints.Handset).subscribe(r => {
      this.isHandset.set(r.matches);
      this.sidenavOpen.set(!r.matches);
    });
  }

  get user() { return this.auth.user(); }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}

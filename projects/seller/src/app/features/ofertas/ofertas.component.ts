import { Component, inject, OnInit, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CurrencyPipe } from '@angular/common';
import { AuthService } from 'auth';
import { CatalogService } from 'api';
import { Oferta } from 'models';
import { environment } from '../../../environments/environment';
import { CriarOfertaDialogComponent } from './criar-oferta-dialog.component';
import { EditarOfertaDialogComponent } from './editar-oferta-dialog.component';

@Component({
  selector: 'app-ofertas',
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatTooltipModule, CurrencyPipe],
  template: `
    <div class="page-header">
      <h2>Ofertas</h2>
      <button mat-flat-button (click)="novaOferta()">
        <mat-icon>add</mat-icon> Nova Oferta
      </button>
    </div>

    <mat-table [dataSource]="ofertas()">
      <ng-container matColumnDef="produto">
        <mat-header-cell *matHeaderCellDef>Produto</mat-header-cell>
        <mat-cell *matCellDef="let o">{{ nomeProduto(o.produtoId) }}</mat-cell>
      </ng-container>

      <ng-container matColumnDef="nome">
        <mat-header-cell *matHeaderCellDef>Oferta</mat-header-cell>
        <mat-cell *matCellDef="let o">{{ o.nome }}</mat-cell>
      </ng-container>

      <ng-container matColumnDef="valor">
        <mat-header-cell *matHeaderCellDef>Valor</mat-header-cell>
        <mat-cell *matCellDef="let o">{{ o.valor | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</mat-cell>
      </ng-container>

      <ng-container matColumnDef="tipo">
        <mat-header-cell *matHeaderCellDef>Tipo</mat-header-cell>
        <mat-cell *matCellDef="let o">{{ o.tipo }}</mat-cell>
      </ng-container>

      <ng-container matColumnDef="status">
        <mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
        <mat-cell *matCellDef="let o">{{ o.ativa ? 'Ativa' : 'Inativa' }}</mat-cell>
      </ng-container>

      <ng-container matColumnDef="acoes">
        <mat-header-cell *matHeaderCellDef></mat-header-cell>
        <mat-cell *matCellDef="let o">
          <button mat-icon-button matTooltip="Editar oferta" (click)="editar(o)">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button matTooltip="Copiar link de checkout" (click)="copiarLink(o)">
            <mat-icon>link</mat-icon>
          </button>
          @if (o.ativa) {
            <button mat-icon-button matTooltip="Desativar oferta" (click)="desativar(o)">
              <mat-icon>block</mat-icon>
            </button>
          }
        </mat-cell>
      </ng-container>

      <mat-header-row *matHeaderRowDef="colunas"></mat-header-row>
      <mat-row *matRowDef="let row; columns: colunas"></mat-row>
    </mat-table>

    @if (linkCopiado()) {
      <div class="snack">Link copiado!</div>
    }
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    h2 { margin: 0; }
    mat-table { width: 100%; }
    .snack {
      position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
      background: #323232; color: #fff; padding: 10px 20px; border-radius: 4px;
      font-size: 0.875rem; z-index: 1000;
    }
  `],
})
export class OfertasComponent implements OnInit {
  private auth    = inject(AuthService);
  private catalog = inject(CatalogService);
  private dialog  = inject(MatDialog);

  ofertas     = signal<Oferta[]>([]);
  linkCopiado = signal(false);
  colunas     = ['produto', 'nome', 'valor', 'tipo', 'status', 'acoes'];

  private produtoNomes = new Map<string, string>();

  ngOnInit(): void {
    this.carregar();
  }

  nomeProduto(produtoId: string): string {
    return this.produtoNomes.get(produtoId) ?? produtoId.slice(0, 8) + '…';
  }

  novaOferta(): void {
    const ref = this.dialog.open(CriarOfertaDialogComponent, { width: '440px' });
    ref.afterClosed().subscribe((nova: Oferta | undefined) => {
      if (nova) {
        this.ofertas.update(lista => [nova, ...lista]);
        this.carregarNomesProdutos([nova]);
      }
    });
  }

  editar(oferta: Oferta): void {
    const ref = this.dialog.open(EditarOfertaDialogComponent, {
      width: '440px',
      data: oferta,
    });
    ref.afterClosed().subscribe((atualizada: Oferta | undefined) => {
      if (atualizada) {
        this.ofertas.update(lista =>
          lista.map(o => o.id === atualizada.id ? atualizada : o)
        );
      }
    });
  }

  copiarLink(oferta: Oferta): void {
    const url = `${environment.checkoutUrl}/oferta/${oferta.id}`;
    navigator.clipboard.writeText(url).then(() => {
      this.linkCopiado.set(true);
      setTimeout(() => this.linkCopiado.set(false), 2500);
    });
  }

  desativar(oferta: Oferta): void {
    const contaId = this.auth.user()?.contaId;
    if (!contaId) return;
    this.catalog.desativarOferta(oferta.id, contaId).subscribe(() =>
      this.ofertas.update(lista =>
        lista.map(o => o.id === oferta.id ? { ...o, ativa: false } : o)
      )
    );
  }

  private carregar(): void {
    const contaId = this.auth.user()?.contaId;
    if (!contaId) return;

    this.catalog.listarOfertas(contaId).subscribe(res => {
      this.ofertas.set(res.data);
      this.carregarNomesProdutos(res.data);
    });
  }

  private carregarNomesProdutos(lista: Oferta[]): void {
    const contaId = this.auth.user()?.contaId;
    if (!contaId) return;
    const idsNovos = [...new Set(lista.map(o => o.produtoId))]
        .filter(id => !this.produtoNomes.has(id));
    if (idsNovos.length === 0) return;
    this.catalog.listar(contaId).subscribe(res =>
      res.data.forEach(p => this.produtoNomes.set(p.id, p.nome))
    );
  }
}

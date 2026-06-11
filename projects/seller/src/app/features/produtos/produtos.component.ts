import { Component, inject, OnInit, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CurrencyPipe } from '@angular/common';
import { AuthService } from 'auth';
import { CatalogService } from 'api';
import { Produto } from 'models';
import { environment } from '../../../environments/environment';
import { CriarProdutoDialogComponent } from './criar-produto-dialog.component';
import { EditarProdutoDialogComponent } from './editar-produto-dialog.component';

@Component({
  selector: 'app-produtos',
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatTooltipModule, CurrencyPipe],
  template: `
    <div class="page-header">
      <h2>Produtos</h2>
      <button mat-flat-button (click)="novoProduto()">
        <mat-icon>add</mat-icon> Novo Produto
      </button>
    </div>

    <mat-table [dataSource]="produtos()">
      <ng-container matColumnDef="nome">
        <mat-header-cell *matHeaderCellDef>Nome</mat-header-cell>
        <mat-cell *matCellDef="let p">{{ p.nome }}</mat-cell>
      </ng-container>

      <ng-container matColumnDef="tipo">
        <mat-header-cell *matHeaderCellDef>Tipo</mat-header-cell>
        <mat-cell *matCellDef="let p">{{ p.tipo }}</mat-cell>
      </ng-container>

      <ng-container matColumnDef="preco">
        <mat-header-cell *matHeaderCellDef>Preco</mat-header-cell>
        <mat-cell *matCellDef="let p">{{ p.preco | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</mat-cell>
      </ng-container>

      <ng-container matColumnDef="ativo">
        <mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
        <mat-cell *matCellDef="let p">{{ p.ativo ? 'Ativo' : 'Inativo' }}</mat-cell>
      </ng-container>

      <ng-container matColumnDef="acoes">
        <mat-header-cell *matHeaderCellDef></mat-header-cell>
        <mat-cell *matCellDef="let p">
          <button mat-icon-button matTooltip="Editar produto" (click)="editar(p)">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button matTooltip="Copiar link de checkout" (click)="copiarLink(p)">
            <mat-icon>link</mat-icon>
          </button>
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
export class ProdutosComponent implements OnInit {
  private auth = inject(AuthService);
  private catalog = inject(CatalogService);
  private dialog = inject(MatDialog);

  produtos = signal<Produto[]>([]);
  linkCopiado = signal(false);
  colunas = ['nome', 'tipo', 'preco', 'ativo', 'acoes'];

  ngOnInit(): void {
    this.carregarProdutos();
  }

  novoProduto(): void {
    const ref = this.dialog.open(CriarProdutoDialogComponent, { width: '440px' });
    ref.afterClosed().subscribe((novo: Produto | undefined) => {
      if (novo) this.produtos.update(lista => [novo, ...lista]);
    });
  }

  editar(produto: Produto): void {
    const ref = this.dialog.open(EditarProdutoDialogComponent, {
      width: '440px',
      data: produto,
    });
    ref.afterClosed().subscribe((atualizado: Produto | undefined) => {
      if (atualizado) {
        this.produtos.update(lista =>
          lista.map(p => p.id === atualizado.id ? atualizado : p)
        );
      }
    });
  }

  copiarLink(produto: Produto): void {
    const contaId = this.auth.user()?.contaId ?? '';
    const url = `${environment.checkoutUrl}/loja/${contaId}/${produto.id}`;
    navigator.clipboard.writeText(url).then(() => {
      this.linkCopiado.set(true);
      setTimeout(() => this.linkCopiado.set(false), 2500);
    });
  }

  private carregarProdutos(): void {
    const contaId = this.auth.user()?.contaId;
    if (!contaId) return;
    this.catalog.listar(contaId).subscribe(res => this.produtos.set(res.data));
  }
}

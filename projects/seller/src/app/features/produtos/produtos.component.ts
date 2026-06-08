import { Component, inject, OnInit, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { AuthService } from 'auth';
import { CatalogService } from 'api';
import { Produto } from 'models';

@Component({
  selector: 'app-produtos',
  imports: [MatTableModule, MatButtonModule, MatIconModule, CurrencyPipe],
  template: `
    <div class="page-header">
      <h2>Produtos</h2>
    </div>

    <mat-table [dataSource]="produtos()">
      <ng-container matColumnDef="nome">
        <mat-header-cell *matHeaderCellDef>Nome</mat-header-cell>
        <mat-cell *matCellDef="let p">{{ p.nome }}</mat-cell>
      </ng-container>
      <ng-container matColumnDef="preco">
        <mat-header-cell *matHeaderCellDef>Preço</mat-header-cell>
        <mat-cell *matCellDef="let p">{{ p.preco | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</mat-cell>
      </ng-container>
      <ng-container matColumnDef="ativo">
        <mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
        <mat-cell *matCellDef="let p">{{ p.ativo ? 'Ativo' : 'Inativo' }}</mat-cell>
      </ng-container>

      <mat-header-row *matHeaderRowDef="colunas"></mat-header-row>
      <mat-row *matRowDef="let row; columns: colunas"></mat-row>
    </mat-table>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    h2 { margin: 0; }
    mat-table { width: 100%; }
  `],
})
export class ProdutosComponent implements OnInit {
  private auth = inject(AuthService);
  private catalog = inject(CatalogService);

  produtos = signal<Produto[]>([]);
  colunas = ['nome', 'preco', 'ativo'];

  ngOnInit(): void {
    const contaId = this.auth.user()?.contaId;
    if (!contaId) return;
    this.catalog.listar(contaId).subscribe(res => this.produtos.set(res.data.content));
  }
}

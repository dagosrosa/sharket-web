import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { CurrencyPipe, DatePipe, SlicePipe } from '@angular/common';
import { AuthService } from 'auth';
import { CommerceService } from 'api';
import { Pedido } from 'models';

@Component({
  selector: 'app-pedido-detalhe',
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    CurrencyPipe,
    DatePipe,
    SlicePipe,
  ],
  template: `
    <div class="page-header">
      <a mat-icon-button routerLink="/app/pedidos">
        <mat-icon>arrow_back</mat-icon>
      </a>
      <h2>Pedido #{{ pedido()?.id | slice:0:8 }}</h2>
    </div>

    @if (pedido(); as p) {
      <div class="details-grid">
        <mat-card>
          <mat-card-header><mat-card-title>Informações</mat-card-title></mat-card-header>
          <mat-card-content>
            <p><strong>Status:</strong> <mat-chip>{{ p.status }}</mat-chip></p>
            <p><strong>Data:</strong> {{ p.criadoEm | date:'dd/MM/yyyy HH:mm' }}</p>
            <p><strong>Total:</strong> {{ p.total | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</p>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header><mat-card-title>Itens</mat-card-title></mat-card-header>
          <mat-card-content>
            <mat-table [dataSource]="p.itens">
              <ng-container matColumnDef="produto">
                <mat-header-cell *matHeaderCellDef>Produto</mat-header-cell>
                <mat-cell *matCellDef="let i">{{ i.nomeProduto }}</mat-cell>
              </ng-container>
              <ng-container matColumnDef="qtd">
                <mat-header-cell *matHeaderCellDef>Qtd</mat-header-cell>
                <mat-cell *matCellDef="let i">{{ i.quantidade }}</mat-cell>
              </ng-container>
              <ng-container matColumnDef="preco">
                <mat-header-cell *matHeaderCellDef>Preço unit.</mat-header-cell>
                <mat-cell *matCellDef="let i">{{ i.precoUnitario | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</mat-cell>
              </ng-container>
              <ng-container matColumnDef="subtotal">
                <mat-header-cell *matHeaderCellDef>Subtotal</mat-header-cell>
                <mat-cell *matCellDef="let i">{{ i.quantidade * i.precoUnitario | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</mat-cell>
              </ng-container>

              <mat-header-row *matHeaderRowDef="colunasItens"></mat-header-row>
              <mat-row *matRowDef="let row; columns: colunasItens"></mat-row>
            </mat-table>
          </mat-card-content>
        </mat-card>
      </div>
    } @else {
      <p>Carregando...</p>
    }
  `,
  styles: [`
    .page-header { display: flex; align-items: center; gap: 8px; margin-bottom: 24px; h2 { margin: 0; } }
    .details-grid { display: grid; gap: 16px; }
    mat-table { width: 100%; }
    p { margin: 8px 0; }
  `],
})
export class PedidoDetalheComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private commerce = inject(CommerceService);

  pedido = signal<Pedido | null>(null);
  colunasItens = ['produto', 'qtd', 'preco', 'subtotal'];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    const contaId = this.auth.user()?.contaId;
    if (!contaId) return;
    this.commerce.buscar(id, contaId).subscribe(res => this.pedido.set(res.data));
  }
}

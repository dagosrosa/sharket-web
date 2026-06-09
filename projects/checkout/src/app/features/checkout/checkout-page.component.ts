import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { switchMap } from 'rxjs';
import { CommerceService, PaymentService } from 'api';
import { CheckoutStateService, MetodoPagamento } from '../../services/checkout-state.service';

@Component({
  selector: 'app-checkout-page',
  imports: [
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    CurrencyPipe,
    TitleCasePipe,
  ],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss',
})
export class CheckoutPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private commerce = inject(CommerceService);
  private payment = inject(PaymentService);
  state = inject(CheckoutStateService);

  dadosForm = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
  });

  pagamentoForm = this.fb.nonNullable.group({
    metodo: ['PIX' as MetodoPagamento, Validators.required],
    numeroCartao: [''],
    nomeTitular: [''],
    validade: [''],
    cvv: [''],
  });

  loading = signal(false);
  erro = signal('');

  get metodo() {
    return this.pagamentoForm.controls.metodo.value;
  }

  ngOnInit(): void {
    if (!this.state.produto()) {
      this.router.navigate(['/erro']);
    }
  }

  confirmar(): void {
    if (this.dadosForm.invalid || this.pagamentoForm.invalid) return;

    this.loading.set(true);
    this.erro.set('');

    const { nome, email, cpf } = this.dadosForm.getRawValue();
    const { metodo } = this.pagamentoForm.getRawValue();

    this.state.dadosComprador.set({ nome, email, cpf });
    this.state.metodoPagamento.set(metodo);

    const produto = this.state.produto()!;
    const contaId = this.state.contaId();

    this.commerce.criar({
      produtoId: produto.id,
      clienteNome: nome,
      clienteEmail: email,
      clienteDocumento: cpf,
      metodo,
      valor: produto.preco,
      parcelas: 1,
    }, contaId).pipe(
      switchMap(pedidoRes => this.payment.processar({
        pedidoId: pedidoRes.data.pedidoId,
        gateway: 'GETNET',
        metodo,
        valor: produto.preco,
        parcelas: 1,
      }, contaId))
    ).subscribe({
      next: pagamentoRes => {
        this.state.pagamentoResultado.set(pagamentoRes.data);
        this.loading.set(false);
        this.router.navigate(['/sucesso']);
      },
      error: () => {
        this.erro.set('Nao foi possivel processar o pagamento. Tente novamente.');
        this.loading.set(false);
      },
    });
  }
}

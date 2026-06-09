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
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
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
    CurrencyPipe,
    TitleCasePipe,
  ],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss',
})
export class CheckoutPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
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

    const { nome, email, cpf } = this.dadosForm.getRawValue();
    this.state.dadosComprador.set({ nome, email, cpf });
    this.state.metodoPagamento.set(this.metodo);

    setTimeout(() => {
      this.router.navigate(['/sucesso']);
    }, 1500);
  }
}

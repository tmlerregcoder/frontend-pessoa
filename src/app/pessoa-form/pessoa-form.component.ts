import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PessoaService } from '../pessoa.service';
import { ActivatedRoute, Router } from '@angular/router';

import { ReactiveFormsModule } from '@angular/forms';
import { Pessoa } from '../models/pessoa';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pessoa-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './pessoa-form.component.html',
  styleUrls: ['./pessoa-form.component.css'],
})
export class PessoaFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private pessoaService = inject(PessoaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  pessoaForm: FormGroup = new FormGroup({});
  pessoaId: string | null = null;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.pessoaId = params['id'];
      if (this.pessoaId) {
        this.carregarPessoaParaEdicao(this.pessoaId);
      }
    });
    this.pessoaForm = this.fb.group({
      nome: ['', Validators.required],
      sexo: ['', Validators.required],
      cpf: ['', Validators.required],
      altura: [null, [Validators.required, Validators.min(0)]],
      peso: [null, [Validators.required, Validators.min(0)]],
      dataNascimento: ['', Validators.required],
    });
  }

  carregarPessoaParaEdicao(id: string): void {
    this.pessoaService.pesquisar(id).subscribe((pessoa) => {
      this.pessoaForm.patchValue({
        nome: pessoa.nome,
        sexo: pessoa.sexo,
        cpf: pessoa.cpf,
        altura: pessoa.altura,
        peso: pessoa.peso,
        dataNascimento: this.formatDate(pessoa.dataNascimento),
      });
    });
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  onSubmit(): void {
    if (this.pessoaForm.valid) {
      const pessoa: Pessoa = this.pessoaForm.value;
      if (this.pessoaId) {
        this.pessoaService.alterar(this.pessoaId, pessoa).subscribe(() => {
          this.router.navigate(['/pessoas'], {
            queryParams: {
              carregarTabela:true
            }
          });
        });
      } else {
        this.pessoaService.incluir(pessoa).subscribe(() => {
          this.router.navigate(['/pessoas'],{
            queryParams: {
              carregarTabela:true
            }
          });
        });
      }
    }
  }

  cancelar(): void {
    this.router.navigate(['/pessoas']);
  }
}

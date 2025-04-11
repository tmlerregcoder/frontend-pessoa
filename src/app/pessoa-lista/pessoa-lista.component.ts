import { Component, OnInit, inject } from '@angular/core';
import { PessoaService } from '../pessoa.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { Pessoa } from '../models/pessoa';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-pessoa-lista',
  standalone: true,
  imports: [DatePipe, CommonModule,PopupComponent],
  templateUrl: './pessoa-lista.component.html',
  styleUrls: ['./pessoa-lista.component.css'],
  providers: [DatePipe],
})
export class PessoaListaComponent implements OnInit {
  private pessoaService = inject(PessoaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private datePipe = inject(DatePipe);
  showPopup: boolean = false;
  popupMessage: string = 'Esta é uma mensagem de exemplo da popup!';



  pessoas: Pessoa[] = [];
  pessoaSelecionada: Pessoa | null = null;
  pesoIdealResultado: number | null = null;


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if(params && params['carregarTabela']==='true'){
        this.carregarPessoas();
      }
    });

  }

  carregarPessoas(): void {
    this.pessoaService.listarPessoas().subscribe({
      next: (data: Pessoa[]) => {
        this.pessoas = data;
      },
      error: (error) => {}
    });
  }

  adicionarPessoa(): void {
    this.router.navigate(['/pessoas/form']);
  }

  pesquisarPessoa(): void {
    this.carregarPessoas();
  }

  selecionarPessoa(pessoa: Pessoa): void {
    this.pessoaSelecionada = pessoa;
    this.pesoIdealResultado = null;
  }

  editarPessoa(id: string | undefined): void {
    if (id !== undefined) {
      this.router.navigate(['/pessoas/form', id]);
    }
  }

  excluirPessoa(id: string | undefined): void {
    if (id !== undefined && confirm('Tem certeza que deseja excluir esta pessoa?')) {
      this.pessoaService.excluir(id).subscribe(() => {
        this.carregarPessoas();
        this.pessoaSelecionada = null;
      });
    }
  }

  calcularPesoIdeal(pessoa: Pessoa): void {
    this.pessoaSelecionada = pessoa;
    if (pessoa.id) {
      this.pessoaService
        .calcularPesoIdeal(pessoa.id)
        .subscribe((pesoIdeal) => {this.pesoIdealResultado = pesoIdeal;
          this.popupMessage = `O peso ideal para ${pessoa.nome} é ${pesoIdeal} kg`;
          this.showPopup = true;
        });
    }
  }
  fecharPopup(): void {
    this.showPopup = false;
    this.pesoIdealResultado = null;
    this.pessoaSelecionada = null;
    this.popupMessage = '';
  }

}

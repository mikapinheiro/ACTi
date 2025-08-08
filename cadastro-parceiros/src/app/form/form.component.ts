
// Importa Component e OnInit do Angular
import { Component, OnInit } from '@angular/core';

// Importa ferramentas para formulários reativos
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Importa módulos comuns do Angular (necessário para *ngIf, *ngClass, etc)
import { CommonModule, NgIf, NgClass } from '@angular/common';

// Importa módulo HTTP para comunicação com API
import { HttpClientModule } from '@angular/common/http';

// Importa diretivas e provedor do ngx-mask (máscaras de input)
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

// Importa o serviço responsável por enviar dados para a API
import { PartnerService } from '../services/partner.service';

@Component({
  selector: 'app-form', // Nome do seletor usado em <app-form>
  standalone: true,     // Marca o componente como standalone
  templateUrl: './form.component.html', // Caminho do HTML associado
  styleUrls: ['./form.component.css'], // Caminho do CSS associado
  providers: [provideNgxMask()], // Fornece o ngx-mask para máscaras nos campos
  imports: [ // Módulos que o componente precisa para funcionar
    ReactiveFormsModule,
    CommonModule,
    NgIf,
    NgClass,
    HttpClientModule,
    NgxMaskDirective
  ]
})
export class FormComponent implements OnInit { // Define a classe do componente

  parceiroForm!: FormGroup; // Armazena o formulário reativo
  sucesso: string = '';     // Armazena mensagem de sucesso
  erro: string = '';        // Armazena mensagem de erro

  // Injeta o FormBuilder (para criar formulários) e o PartnerService (para integração com a API)
  constructor(private fb: FormBuilder, private partnerService: PartnerService) {}

  // Método chamado assim que o componente é iniciado
  ngOnInit() {
    // Cria os campos do formulário com suas validações
    this.parceiroForm = this.fb.group({
      tipoParceiro: ['', Validators.required],
      personalidade: ['', Validators.required],
      cnpjCpf: ['', [Validators.required]],
      razaoSocial: ['', Validators.required],
      nomeFantasia: ['', Validators.required],
      segmento: ['', Validators.required],
      categoria: ['', Validators.required],
      cep: ['', Validators.required],
      pais: ['Brasil', Validators.required],
      uf: ['', Validators.required],
      municipio: ['', Validators.required],
      logradouro: ['', Validators.required],
      numero: ['', [Validators.required, Validators.min(1)]],
      bairro: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      celular: ['', Validators.required],
      complemento: [''],
      observacao: ['']
    });
  }

  // Verifica se um campo específico está inválido e foi tocado ou modificado
  formControlInvalido(nomeControle: string): boolean {
    const controle = this.parceiroForm.get(nomeControle);
    return controle ? controle.invalid && (controle.dirty || controle.touched) : false;
  }

  // Marca todos os campos do formulário como "tocados"
  marcarTodosComoTocados() {
    Object.values(this.parceiroForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  // Função executada ao clicar no botão "Enviar"
  onSubmit() {
    if (this.parceiroForm.valid) {
      const parceiro = { ...this.parceiroForm.value };

      this.partnerService.postParceiro(parceiro).subscribe({
        next: () => {
          this.sucesso = 'Cadastro realizado com sucesso!';
          this.erro = '';
        },
        error: () => {
          this.erro = 'Erro ao cadastrar parceiro.';
          this.sucesso = '';
        }
      });

    } else {
      this.marcarTodosComoTocados();
    }
  }

  // Consulta o CEP informado e preenche os campos de endereço automaticamente
  consultarCEP() {
    const cep = this.parceiroForm.get('cep')?.value?.replace(/\D/g, '');
    if (cep && cep.length === 8) {
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
          if (!data.erro) {
            this.parceiroForm.patchValue({
              logradouro: data.logradouro,
              bairro: data.bairro,
              municipio: data.localidade,
              uf: data.uf
            });
            this.erro = '';
          } else {
            this.erro = 'CEP não encontrado.';
            this.sucesso = '';
          }
        })
        .catch(() => {
          this.erro = 'Erro ao consultar CEP.';
          this.sucesso = '';
        });
    }
  }

  // Consulta o CNPJ informado e preenche os campos de razão social e fantasia
  consultarCNPJ() {
    const cnpj = this.parceiroForm.get('cnpjCpf')?.value?.replace(/\D/g, '');
    if (cnpj && cnpj.length === 14) {
      fetch(`https://www.receitaws.com.br/v1/cnpj/${cnpj}`)
        .then(response => response.json())
        .then(data => {
          if (!data.status || data.status !== 'ERROR') {
            this.parceiroForm.patchValue({
              razaoSocial: data.nome,
              nomeFantasia: data.fantasia
            });
            this.erro = '';
          } else {
            this.erro = 'CNPJ não encontrado ou inválido.';
            this.sucesso = '';
          }
        })
        .catch(() => {
          this.erro = 'Erro ao consultar CNPJ.';
          this.sucesso = '';
        });
    }
  }
}

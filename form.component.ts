// Importa os módulos necessários do Angular para criar o componente,
// o FormBuilder para construir o formulário e o HttpClient para requisições HTTP.
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // Importa o módulo HTTP

// Define o componente com seletor, HTML e CSS
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  // Define o formulário como uma propriedade da classe
  parceiroForm: FormGroup;
  sucesso: string = ''; // Variável para a mensagem de sucesso
  erro: string = ''; // Variável para a mensagem de erro

  // Construtor que injeta o FormBuilder e o HttpClient
  constructor(private fb: FormBuilder, private http: HttpClient) {
    // Cria o formulário e define todos os campos com suas validações
    this.parceiroForm = this.fb.group({
      tipoParceiro: ['', Validators.required],
      personalidade: ['', Validators.required],
      razaoSocial: ['', Validators.required],
      nomeFantasia: ['', Validators.required],
      cnpjCpf: ['', Validators.required],
      segmento: ['', Validators.required],
      categoria: ['', Validators.required],
      cep: ['', Validators.required],
      pais: ['Brasil'], // Campo com valor padrão
      uf: ['', Validators.required],
      municipio: ['', Validators.required],
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      bairro: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      complemento: [''],
      celular: ['', Validators.required],
      observacao: ['']
    });
  }

  // Função para consultar o CEP usando a API ViaCEP
  consultarCEP(): void {
    // Remove caracteres especiais para obter apenas os números do CEP
    const cep = this.parceiroForm.get('cep')?.value.replace(/\D/g, '');

    // Verifica se o CEP tem 8 dígitos antes de fazer a requisição
    if (cep && cep.length === 8) {
      // Faz a requisição GET para a API do ViaCEP
      this.http.get(`https://viacep.com.br/ws/${cep}/json/`)
        .subscribe((data: any) => {
          // Se a API não retornar erro, preenche os campos do formulário
          if (!data.erro) {
            // Usa patchValue para preencher apenas os campos retornados pela API
            this.parceiroForm.patchValue({
              logradouro: data.logradouro,
              bairro: data.bairro,
              municipio: data.localidade,
              uf: data.uf
            });
          } else {
            // Caso o CEP seja inválido, limpa os campos e exibe um alerta
            this.parceiroForm.patchValue({
              logradouro: '', bairro: '', municipio: '', uf: ''
            });
            alert('CEP não encontrado. Por favor, preencha o endereço manualmente.');
          }
        });
    }
  }

  // Função para consultar o CNPJ usando a API ReceitaWS
  consultarCNPJ(): void {
    // Remove caracteres especiais para obter apenas os números do CNPJ
    const cnpj = this.parceiroForm.get('cnpjCpf')?.value.replace(/\D/g, '');

    // Verifica se o valor é um CNPJ (14 dígitos)
    if (cnpj && cnpj.length === 14) {
      // API da ReceitaWS (atenção: pode ter limite de requisições)
      const apiUrl = `https://receitaws.com.br/v1/cnpj/${cnpj}`;
      
      // Faz a requisição GET para a API
      this.http.get(apiUrl)
        .subscribe(
          (data: any) => {
            // Se a requisição for bem-sucedida e tiver o nome, preenche a Razão Social
            if (data && data.nome) {
              this.parceiroForm.patchValue({ razaoSocial: data.nome });
              alert('Razão Social preenchida automaticamente.');
            } else {
              // Se a resposta for inválida, exibe um alerta
              alert('CNPJ inválido ou não encontrado.');
              this.parceiroForm.controls['razaoSocial'].reset('');
            }
          },
          (error) => {
            // Trata erros da requisição HTTP
            console.error('Erro na requisição da API de CNPJ:', error);
            alert('Não foi possível consultar o CNPJ. Tente novamente ou preencha manualmente.');
            this.parceiroForm.controls['razaoSocial'].reset('');
          }
        );
    } else if (cnpj && cnpj.length < 14) {
      // Limpa a Razão Social se o usuário apagar o CNPJ
      this.parceiroForm.controls['razaoSocial'].reset('');
    }
  }

  // Função chamada ao enviar o formulário
  onSubmit() {
    // Se o formulário estiver válido...
    if (this.parceiroForm.valid) {
      this.sucesso = 'Dados prontos para serem enviados à API! (Simulação)';
      this.erro = '';
      console.log('Dados enviados:', this.parceiroForm.value);
      // Aqui você faria a chamada para a sua API de backend
    } else {
      // Se não estiver, marca todos os campos como "touched" para exibir os erros
      this.marcarTodosComoToucados();
      this.erro = 'Por favor, corrija os campos em vermelho.';
      this.sucesso = '';
    }
  }

  // Função auxiliar para saber se um campo está inválido e foi tocado
  formControlInvalido(campo: string): boolean {
    const control = this.parceiroForm.get(campo);
    // Retorna true se o campo existe, é inválido e já foi tocado pelo usuário
    return !!(control && control.invalid && control.touched);
  }

  // Função auxiliar para marcar todos os campos como tocados ao tentar enviar
  marcarTodosComoToucados() {
    // Itera sobre todos os campos e os marca como tocados
    Object.keys(this.parceiroForm.controls).forEach(key => {
      this.parceiroForm.get(key)?.markAsTouched();
    });
  }
}
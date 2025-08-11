import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators, AbstractControl } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

interface Estado {
  sigla: string;
  nome: string;
}

interface ApiCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

interface ApiCnpjResponse {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  cnae_fiscal_descricao: string;
  situacao: string;
}

interface PartnerData {
  tipo: string;
  tipoPersona: string;
  razaoSocial: string;
  nomeFantasia: string;
  cpfCnpj: string;
  segmento: string;
  categoria: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  municipio: string;
  uf: string;
  pais: string;
  email: string;
  telefone: string;
  celular: string;
  observacao?: string;
}

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './form.html',
  styleUrls: ['./form.css']
})
export class PartnerFormComponent implements OnInit, OnDestroy {
  partnerForm!: FormGroup;
  private destroy$ = new Subject<void>();
  cpfCnpjMask: string = '000.000.000-00';
  cpfCnpjValido: boolean = false;
  
  isLoading = false;
  isSubmitting = false;
  isValidatingDoc = false;
  isValidatingCep = false;
  
  docError: string | null = null;
  cepError: string | null = null;
  
  private readonly API_CONFIG = {
    BACKEND_URL: 'http://localhost:8080/partners',
    PARCEIROS_ENDPOINT: '/',
    GET_MINIMUM: '/partners/minimum',
    GET_FULL: '/partners/full',
    GET_BY_ID: '/byid',
    CNPJ_API: 'https://brasilapi.com.br/api/cnpj/v1',
    CEP_API: 'https://viacep.com.br/ws',
    VALIDATE_ENDPOINT: '/validate'
  };
  
  estados: Estado[] = [
    { sigla: 'AC', nome: 'Acre' },
    { sigla: 'AL', nome: 'Alagoas' },
    { sigla: 'AP', nome: 'Amapá' },
    { sigla: 'AM', nome: 'Amazonas' },
    { sigla: 'BA', nome: 'Bahia' },
    { sigla: 'CE', nome: 'Ceará' },
    { sigla: 'DF', nome: 'Distrito Federal' },
    { sigla: 'ES', nome: 'Espírito Santo' },
    { sigla: 'GO', nome: 'Goiás' },
    { sigla: 'MA', nome: 'Maranhão' },
    { sigla: 'MT', nome: 'Mato Grosso' },
    { sigla: 'MS', nome: 'Mato Grosso do Sul' },
    { sigla: 'MG', nome: 'Minas Gerais' },
    { sigla: 'PA', nome: 'Pará' },
    { sigla: 'PB', nome: 'Paraíba' },
    { sigla: 'PR', nome: 'Paraná' },
    { sigla: 'PE', nome: 'Pernambuco' },
    { sigla: 'PI', nome: 'Piauí' },
    { sigla: 'RJ', nome: 'Rio de Janeiro' },
    { sigla: 'RN', nome: 'Rio Grande do Norte' },
    { sigla: 'RS', nome: 'Rio Grande do Sul' },
    { sigla: 'RO', nome: 'Rondônia' },
    { sigla: 'RR', nome: 'Roraima' },
    { sigla: 'SC', nome: 'Santa Catarina' },
    { sigla: 'SP', nome: 'São Paulo' },
    { sigla: 'SE', nome: 'Sergipe' },
    { sigla: 'TO', nome: 'Tocantins' }
  ];

  paises = [
    'Brasil',
    'Argentina', 
    'Chile', 
    'Uruguai', 
    'Paraguai', 
    'Bolívia',
    'Estados Unidos',
    'Canadá',
    'México',
    'Portugal',
    'Espanha',
    'França',
    'Alemanha',
    'Itália',
    'Reino Unido',
    'Japão',
    'China',
    'Coreia do Sul',
    'Austrália'
  ];

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.setupFormSubscriptions();
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadInitialData(): void {
    console.log('Componente inicializado com endpoints:', this.API_CONFIG);
  }

  private initializeForm(): void {
    this.partnerForm = this.fb.group({
      tipo: ['', [Validators.required]],
      tipoPersona: ['', [Validators.required]],
      razaoSocial: ['', [Validators.required, this.customValidators.minLength(2)]],
      nomeFantasia: ['', [Validators.required, this.customValidators.minLength(2)]],
      cpfCnpj: ['', [Validators.required]],
      segmento: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      cep: ['', [Validators.required, this.customValidators.cepValidator]],
      logradouro: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      complemento: [''],
      bairro: ['', [Validators.required]],
      municipio: ['', [Validators.required]],
      uf: ['', [Validators.required]],
      pais: ['Brasil', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required, this.customValidators.telefoneValidator]],
      celular: ['', [Validators.required, this.customValidators.telefoneValidator]],
      observacao: ['', [this.customValidators.maxLength(500)]]
    });
  }

  private setupFormSubscriptions(): void {
    this.partnerForm.get('cpfCnpj')?.valueChanges
      .pipe(
        debounceTime(800),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        if (value && value.length >= 11) {
          this.validateDocumento();
        }
      });

    this.partnerForm.get('cep')?.valueChanges
      .pipe(
        debounceTime(800),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        if (value && value.length === 8) {
          this.consultarCEP();
        }
      });

    this.partnerForm.get('tipoPersona')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.partnerForm.patchValue({
          cpfCnpj: '',
          razaoSocial: '',
          nomeFantasia: ''
        });
        this.docError = null;

        if (value === 'juridica') {
          this.cpfCnpjMask = '00.000.000/0000-00';
          this.partnerForm.get('cpfCnpj')?.setValue('');
        } else {
          this.cpfCnpjMask = '000.000.000-00';
          this.partnerForm.get('cpfCnpj')?.setValue('');
        }
      });
  }

  private customValidators = {
    minLength: (min: number) => (control: AbstractControl) => {
      if (!control.value || control.value.length < min) {
        return { minLength: { min, actual: control.value?.length || 0 } };
      }
      return null;
    },

    maxLength: (max: number) => (control: AbstractControl) => {
      if (control.value && control.value.length > max) {
        return { maxLength: { max, actual: control.value.length } };
      }
      return null;
    },

    cepValidator: (control: AbstractControl) => {
      const cep = control.value?.replace(/\D/g, '');
      if (cep && cep.length !== 8) {
        return { invalidCep: true };
      }
      return null;
    },

    telefoneValidator: (control: AbstractControl) => {
      const phone = control.value?.replace(/\D/g, '');
      if (phone && (phone.length < 10 || phone.length > 11)) {
        return { invalidPhone: true };
      }
      return null;
    }
  };

  formatarCpfCnpj(event: any): void {
    const value = event.target.value.replace(/\D/g, '');
    const personalidade = this.partnerForm.get('tipoPersona')?.value;
    
    if (personalidade === 'fisica') {
      event.target.value = this.aplicarMascaraCPF(value);
    } else if (personalidade === 'juridica') {
      event.target.value = this.aplicarMascaraCNPJ(value);
    } else {
      event.target.value = value;
    }
    
    this.partnerForm.get('cpfCnpj')?.setValue(value, { emitEvent: false });
  }

  formatarCEP(event: any): void {
    const value = event.target.value.replace(/\D/g, '');
    event.target.value = this.aplicarMascaraCEP(value);
    this.partnerForm.get('cep')?.setValue(value, { emitEvent: false });
  }

  formatarTelefone(event: any, fieldName: string): void {
    const value = event.target.value.replace(/\D/g, '');
    event.target.value = this.aplicarMascaraTelefone(value);
    this.partnerForm.get(fieldName)?.setValue(value, { emitEvent: false });
  }
  aplicarMascaraCPF(value: string): string {
    return value.replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  }

  aplicarMascaraCNPJ(value: string): string {
    return value.replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  }

  aplicarMascaraCEP(value: string): string {
    return value.replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  }

  aplicarMascaraTelefone(value: string): string {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d)/, '($1) $2-$3');
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d)/, '($1) $2-$3');
    }
  }

  isInvalid(field: string): boolean {
    const control = this.partnerForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  permitirApenasNumeros(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Delete'];
    
    if (allowedKeys.indexOf(event.key) !== -1 || 
        (event.key >= '0' && event.key <= '9')) {
      return;
    }
    
    event.preventDefault();
  }

  async validateDocumento(): Promise<void> {
    const docControl = this.partnerForm.get('cpfCnpj');
    if (!docControl?.value) return;

    const doc = docControl.value.replace(/\D/g, '');
    if (!doc) return;

    this.isValidatingDoc = true;
    this.docError = null;

    try {
      if (doc.length <= 11) {
        if (!this.validarCPF(doc)) {
          this.docError = 'CPF inválido';
          return;
        }
      } else {
        if (!this.validarCNPJ(doc)) {
          this.docError = 'CNPJ inválido';
          return;
        }

        // REMOVENDO VERIFICAÇÃO DE CNPJ ATIVO
        // A lógica abaixo faz uma consulta à API e verifica se o CNPJ está ativo.
        // Ao remover este bloco, o formulário validará apenas o formato do CNPJ.
        /*
        try {
          const data = await this.consultarCNPJ(doc);
          if (data) {
            this.preencherDadosCNPJ(data);
          }
        } catch (error) {
          this.docError = 'CNPJ não encontrado ou inativo';
          console.warn('Erro ao consultar CNPJ:', error);
        }
        */
      }
    } finally {
      this.isValidatingDoc = false;
    }
  }

  private async consultarCNPJ(cnpj: string): Promise<ApiCnpjResponse> {
    try {
      const response = await this.http.get<ApiCnpjResponse>(`${this.API_CONFIG.CNPJ_API}/${cnpj}`)
        .toPromise();
      return response as ApiCnpjResponse;
    } catch (error) {
      console.error('Erro na consulta CNPJ:', error);
      throw error;
    }
  }

  private preencherDadosCNPJ(data: ApiCnpjResponse): void {
    // REMOVENDO VERIFICAÇÃO DE CNPJ ATIVO
    // Esta linha verifica o status do CNPJ na Receita Federal.
    // Ao comentar, o formulário não irá mais exibir o erro de "inativo".
    /*
    if (data.situacao !== 'ATIVA') {
      this.docError = 'CNPJ está inativo';
      return;
    }
    */

    this.partnerForm.patchValue({
      razaoSocial: data.razao_social || '',
      nomeFantasia: data.nome_fantasia || data.razao_social || '',
      segmento: data.cnae_fiscal_descricao || ''
    });

    this.showSuccessMessage('Dados do CNPJ carregados automaticamente!');
  }

  async consultarCEP(): Promise<void> {
    const cepControl = this.partnerForm.get('cep');
    if (!cepControl?.value) return;

    const cep = cepControl.value.replace(/\D/g, '');
    if (!cep || cep.length !== 8) {
      this.cepError = 'CEP deve ter 8 dígitos';
      return;
    }

    this.isValidatingCep = true;
    this.cepError = null;

    try {
      const data = await this.consultarViaCEP(cep);
      if (data.erro) {
        this.cepError = 'CEP não encontrado';
        return;
      }

      this.preencherDadosCEP(data);
      this.showSuccessMessage('Endereço carregado automaticamente!');
    } catch (error) {
      this.cepError = 'Erro ao consultar CEP. Tente novamente.';
      console.error('Erro na consulta CEP:', error);
    } finally {
      this.isValidatingCep = false;
    }
  }

  private async consultarViaCEP(cep: string): Promise<ApiCepResponse> {
    try {
      const response = await this.http.get<ApiCepResponse>(`${this.API_CONFIG.CEP_API}/${cep}/json/`)
        .toPromise();
      return response as ApiCepResponse;
    } catch (error) {
      console.error('Erro na consulta CEP:', error);
      throw error;
    }
  }

  private preencherDadosCEP(data: ApiCepResponse): void {
    this.partnerForm.patchValue({
      logradouro: data.logradouro || '',
      bairro: data.bairro || '',
      municipio: data.localidade || '',
      uf: data.uf || '',
      pais: 'Brasil'
    });
  }

  private validarCPF(cpf: string): boolean {
    if (!cpf || cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return false;
    }

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;
    
    return resto === parseInt(cpf.charAt(10));
  }

  private validarCNPJ(cnpj: string): boolean {
    if (!cnpj || cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
      return false;
    }

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    return resultado === parseInt(digitos.charAt(1));
  }

  private showSuccessMessage(message: string): void {
    this.showToast(message, 'success');
  }

  private showErrorMessage(message: string): void {
    this.showToast(message, 'error');
  }

  private showToast(message: string, type: 'success' | 'error' | 'warning' = 'success'): void {
    const container = document.getElementById('toast-container');
    if (!container) {
      console.log(`${type.toUpperCase()}: ${message}`);
      return;
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : '⚠️'}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    
    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 5000);
  }

  private resetForm(): void {
    this.partnerForm.reset();
    this.partnerForm.patchValue({
      pais: 'Brasil'
    });
    this.docError = null;
    this.cepError = null;
  }

  async onSubmit(): Promise<void> {
    if (this.partnerForm.invalid) {
      this.partnerForm.markAllAsTouched();
      this.showErrorMessage('Por favor, corrija os campos marcados em vermelho.');
      
      const firstInvalidField = document.querySelector('.ng-invalid');
      if (firstInvalidField) {
        firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    this.isSubmitting = true;

    try {
      const formData: PartnerData = this.prepareFormData();
      
      const response = await this.submitToBackend(formData);
      
      if (response) {
        this.showSuccessMessage('✅ Parceiro cadastrado com sucesso!');
        this.resetForm();
      }
      
    } catch (error: any) {
      console.error('Erro ao enviar formulário:', error);
      const errorMessage = error?.error?.message || 'Falha ao cadastrar parceiro. Tente novamente.';
      this.showErrorMessage(errorMessage);
    } finally {
      this.isSubmitting = false;
    }
  }

  private prepareFormData(): PartnerData {
      const formValue = this.partnerForm.value;
      
      const cleanDoc = formValue.cpfCnpj.replace(/\D/g, '');
      const cleanTelefone = formValue.telefone.replace(/\D/g, '');
      const cleanCelular = formValue.celular.replace(/\D/g, '');
      const cleanCep = formValue.cep.replace(/\D/g, '');

      return {
          tipo: formValue.tipo.toUpperCase(), 
          tipoPersona: formValue.tipoPersona.toUpperCase(),
          razaoSocial: formValue.razaoSocial,
          nomeFantasia: formValue.nomeFantasia,
          cpfCnpj: cleanDoc,
          segmento: formValue.segmento,
          categoria: formValue.categoria,
          cep: cleanCep,
          logradouro: formValue.logradouro,
          numero: formValue.numero,
          complemento: formValue.complemento || '',
          bairro: formValue.bairro,
          municipio: formValue.municipio,
          uf: formValue.uf,
          pais: formValue.pais,
          email: formValue.email,
          telefone: cleanTelefone,
          celular: cleanCelular,
          observacao: formValue.observacao || ''
      };
  }

  private async submitToBackend(data: PartnerData): Promise<any> {
    const url = `${this.API_CONFIG.BACKEND_URL}${this.API_CONFIG.PARCEIROS_ENDPOINT}`;
    
    console.log('Enviando dados para:', url);
    console.log('Dados:', data);

    try {
      const response = await this.http.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
        }
      }).toPromise();

      return response;
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
    }
  }

  getErrorMessage(field: string): string {
    const control = this.partnerForm.get(field);
    if (control?.errors) {
      if (control.errors['required']) return 'Campo obrigatório';
      if (control.errors['email']) return 'E-mail inválido';
      if (control.errors['minLength']) return `Mínimo ${control.errors['minLength'].min} caracteres`;
      if (control.errors['maxLength']) return `Máximo ${control.errors['maxLength'].max} caracteres`;
      if (control.errors['invalidCep']) return 'CEP inválido';
      if (control.errors['invalidPhone']) return 'Telefone inválido';
    }
    return '';
  }

  isFieldValid(field: string): boolean {
    const control = this.partnerForm.get(field);
    return !!(control && control.valid && (control.dirty || control.touched));
  }

  updateApiConfig(newConfig: Partial<typeof this.API_CONFIG>): void {
    Object.assign(this.API_CONFIG, newConfig);
    console.log('Configuração de API atualizada:', this.API_CONFIG);
  }

  getInvalidFields(): string[] {
    const invalid = [];
    const controls = this.partnerForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
}
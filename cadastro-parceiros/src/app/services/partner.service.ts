// Serviço Angular responsável por intermediar a comunicação entre o front-end e o back-end da API de partners.

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root' // Torna o serviço disponível para toda a aplicação
})
export class PartnerService {

  private apiUrl = 'http://localhost:8080/partners/'; // URL base da API

  constructor(private http: HttpClient) {}

  /**
   * Envia os dados do parceiro para o back-end via método POST.
   * @param parceiro Objeto com os dados do formulário preenchido
   * @returns Observable com a resposta da API
   */
  postParceiro(parceiro: any): Observable<any> {
    return this.http.post(this.apiUrl, parceiro)
      .pipe(
        catchError(this.handleError) // Trata possíveis erros
      );
  }

  /**
   * Função para tratar erros da requisição HTTP.
   * Pode ser expandida para exibir mensagens específicas por tipo de erro.
   * @param error Objeto de erro retornado pelo HttpClient
   * @returns Observable com erro tratado
   */
  private handleError(error: HttpErrorResponse) {
    console.error('Erro ao comunicar com o servidor:', error);
    return throwError(() => new Error('Erro ao comunicar com o servidor. Por favor, tente novamente.'));
  }
}

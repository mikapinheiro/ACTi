import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string; // município
  uf: string;
}

@Injectable({ providedIn: 'root' })
export class PartnerService {
private base_url = 'http://localhost:8080/partners';


  constructor(private http: HttpClient) {}

  consultarCep(cep: string): Observable<ViaCepResponse> {
    const onlyDigits = cep.replace(/\D/g, '');
    return this.http.get<ViaCepResponse>(`https://viacep.com.br/ws/${onlyDigits}/json/`);
  }

  consultarCNPJ(cnpj: string): Observable<any> {
    const onlyDigits = cnpj.replace(/\D/g, '');
    return this.http.get<any>(`https://www.receitaws.com.br/v1/cnpj/${onlyDigits}`);
  }

  cadastrarParceiro(payload: any): Observable<any> {
    return this.http.post(`${this.base_url}/parceiros`, payload);
  }

  getMinimumPartners(): Observable<any> {
    return this.http.get(`${this.base_url}/minimum`);
  }

  getFullPartners(): Observable<any> {
    return this.http.get(`${this.base_url}/full`);
  }

  getPartnerById(id: string): Observable<any> {
    return this.http.get(`${this.base_url}/byid/${id}`);
  }

  createPartner(data: any): Observable<any> {
    return this.http.post(`${this.base_url}/`, data);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { formatDateYearMonthDay } from '../util/convert-dates';

@Injectable({
  providedIn: 'root'
})
export class TransacaoService {

  constructor(private http: HttpClient) { }

  postLancarTransferenciaFinanceira(param: any): Observable<any> {
    return this.http.post<any>(`${environment.BANCO_URL_API}/transacoes`, param);
  }

  getRelatorioTransferenciasDia(selectedDate: Date): Observable<any[]> {
    const formattedDate = formatDateYearMonthDay(selectedDate);
    return this.http.get<any[]>(`${environment.BANCO_URL_API}/transacoes/relatorio?date=${formattedDate}`);
  }

  getExtratoContaCliente(contaId: any): Observable<any[]> {
    return this.http.get<any[]>(`${environment.BANCO_URL_API}/transacoes?contaId=${contaId}`);
  }

}

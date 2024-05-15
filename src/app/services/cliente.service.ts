import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, interval, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private http: HttpClient) { }

  getClientesAutoRefresh(): Observable<any> {
    return interval(15000).pipe(
      switchMap(() => this.getTodosClientes())
    );
  }

  getTodosClientes(): Observable<any>  {
    return this.http.get<any>(`${environment.BANCO_URL_API}/clientes`,);
  }

  getClienteById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.BANCO_URL_API}/clientes/${id}`);
  }

  putCliente(id: number, param: any): Observable<any> {
    return this.http.put<any>(`${environment.BANCO_URL_API}/clientes/${id}`, param);
  }

  postClient(param: any): Observable<any> {
    return this.http.post<any>(`${environment.BANCO_URL_API}/clientes`, param);
  }

  deleteCliente(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.BANCO_URL_API}/clientes/${id}`);
  }

}

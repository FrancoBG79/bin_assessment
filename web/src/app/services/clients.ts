import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface Client {
  id: string;
  name: string;
  client_code: string;
  no_linked_contacts: number;
}

@Injectable({
  providedIn: 'root',
})
export class ClientsServices {
  private readonly apiUrl = environment.apiUrl;
  private readonly httpClient = inject(HttpClient);

  postClient(client: Client): Observable<Client> {
    return this.httpClient.post<Client>(`${this.apiUrl}/clients`, client, {
      observe: 'response'
    }).pipe(
      map((response: HttpResponse<Client>) => {
        return response.body as Client;
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); })
    )
  }

  getClients(): Observable<Client[]> {
    return this.httpClient.get<Client[]>(`${this.apiUrl}/clients`, {
      observe: 'response'
    }).pipe(
      map((response: HttpResponse<Client[]>) => {
        return response.body ?? [];
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); })
    )
  }

  getClient(clientID: string): Observable<Client> {
    return this.httpClient.get<Client>(`${this.apiUrl}/clients`, {
      params: { clientID }, observe: 'response'
    }).pipe(
      map((response: HttpResponse<Client>) => {
        return response.body as Client;
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); })
    )
  }

  putClient(clientID: string, client: Client): Observable<Client> {
    return this.httpClient.put<Client>(`${this.apiUrl}/clients`, client, {
      params: { clientID }, observe: 'response'
    }).pipe(
      map((response: HttpResponse<Client>) => {
        return response.body as Client;
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); })
    )
  }

  deleteClient(clientID: string): Observable<Client> {
    return this.httpClient.delete<Client>(`${this.apiUrl}/clients`, {
      params: { clientID }, observe: 'response'
    }).pipe(
      map((response: HttpResponse<Client>) => {
        return response.body as Client;
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); })
    )
  }
}

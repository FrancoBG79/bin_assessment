import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface Client {
  name: string;
  client_code: string;
  no_linked_contacts: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ClientsServices {
  private readonly apiUrl = environment.apiUrl;
  private readonly httpClient = inject(HttpClient);

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
}

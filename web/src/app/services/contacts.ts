import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface Contact {
  id: string;
  name: string;
  surname: string;
  email: string;
  no_of_clients: number;
}
@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  private readonly apiUrl = environment.apiUrl;
  private readonly httpClient = inject(HttpClient);

  postContact(contact: Contact): Observable<Contact[]> {
    return this.httpClient.post<Contact[]>(`${this.apiUrl}/contacts`, contact, {
      observe: 'response'
    }).pipe(
      map((response: HttpResponse<Contact[]>) => {
        return response.body ?? [];
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); })
    )
  }

  getContacts(): Observable<Contact[]> {
    return this.httpClient.get<Contact[]>(`${this.apiUrl}/contacts`, {
      observe: 'response'
    }).pipe(
      map((response: HttpResponse<Contact[]>) => {
        return response.body ?? [];
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); })
    )
  }

  getContact(contactId: string): Observable<Contact> {
    return this.httpClient.get<Contact>(`${this.apiUrl}/contacts`, {
      params: { contactId }, observe: 'response'
    }).pipe(
      map((response: HttpResponse<Contact>) => {
        return response.body as Contact;
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); })
    )
  }

  putContact(contactId: string, contact: Contact): Observable<Contact> {
    return this.httpClient.put<Contact>(`${this.apiUrl}/contacts`, contact, {
      params: { contactId }, observe: 'response'
    }).pipe(
      map((response: HttpResponse<Contact>) => {
        return response.body as Contact;
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); })
    )
  }

  deleteContact(contactId: string): Observable<Contact> {
    return this.httpClient.delete<Contact>(`${this.apiUrl}/contacts`, {
      params: { contactId }, observe: 'response'
    }).pipe(
      map((response: HttpResponse<Contact>) => {
        return response.body as Contact;
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); })
    )
  }
}

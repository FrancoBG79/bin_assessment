import { Injectable } from '@angular/core';

export interface Contacts {
  name: string;
  surname: string;
  email: string;
  no_of_clients: string[];
}
@Injectable({
  providedIn: 'root',
})
export class ContactsService {}

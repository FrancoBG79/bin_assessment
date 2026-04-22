import { Injectable } from '@angular/core';

export interface Clients {
  name: string;
  client_code: string;
  no_linked_contacts: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ClientsServices {}

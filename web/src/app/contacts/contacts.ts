import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs'

@Component({
  selector: 'app-contacts',
  imports: [MatTabsModule],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
})
export class ContactsComponent {}

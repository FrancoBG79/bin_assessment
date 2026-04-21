import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs'

@Component({
  selector: 'app-clients',
  imports: [MatTabsModule],
  templateUrl: './clients.html',
  styleUrl: './clients.scss',
})
export class ClientsComponent {}

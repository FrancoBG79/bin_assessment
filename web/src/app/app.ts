import { Component, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ClientsComponent } from './clients/clients';

@Component({
  selector: 'app-root',
  imports: [MatTabsModule, ClientsComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('web');
}

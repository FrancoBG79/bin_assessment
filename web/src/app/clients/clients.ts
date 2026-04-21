import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs'
import { FieldDefinitionsService } from '../services/field-definitions';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-clients',
  imports: [MatTabsModule],
  templateUrl: './clients.html',
  styleUrl: './clients.scss',
})
export class ClientsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  loading = false;
  private readonly fieldService = inject(FieldDefinitionsService);
  toastrService = inject(ToastrService);

  ngOnInit(): void {
    this.loading = true;
    this.fieldService.getFieldDefinitions('clients')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('response', response);
          this.loading = false;
        },
        error: (error: Error) => {
          console.log(error);
          this.toastrService.error('Error in fetching data: ', error.message);
          this.loading = false;
        }
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

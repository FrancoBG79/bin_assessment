import { AfterViewInit, Component, inject, input, OnDestroy, signal, ViewChild } from '@angular/core';
import { FieldDefinitions, FieldDefinitionsService } from '../services/field-definitions';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-fields',
  imports: [
    MatFormFieldModule, 
    MatInputModule, 
    MatTableModule, 
    MatSortModule, 
    MatPaginatorModule, 
    MatProgressSpinnerModule
  ],
  templateUrl: './fields.html',
  styleUrl: './fields.scss',
})
export class FieldsComponent implements AfterViewInit, OnDestroy {
  entity = input.required<string>();
  displayedColumns: string[] = ['id', 'description', 'field_type', 'compulsory', 'additional_information'];
  dataSource!: MatTableDataSource<FieldDefinitions>;
  private destroy$ = new Subject<void>();
  loading = signal(false);
  private readonly fieldService = inject(FieldDefinitionsService);
  toastrService = inject(ToastrService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngAfterViewInit(): void {
    this.loading.set(true)
    this.fieldService.getFieldDefinitions('clients')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.loading.set(false)
        },
        error: (error: Error) => {
          console.log(error);
          this.toastrService.error('Error in fetching data: ', error.message);
          this.loading.set(false)
        }
      })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

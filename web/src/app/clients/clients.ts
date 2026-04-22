import { Component, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs'
import { FieldsComponent } from '../fields/fields';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Client, ClientsServices } from '../services/clients';
import { MatDialog } from '@angular/material/dialog';
import { ClientDialog } from './client-dialog/client-dialog';

@Component({
  selector: 'app-clients',
  imports: [
    MatTabsModule, 
    FieldsComponent,
    MatFormFieldModule, 
    MatInputModule, 
    MatTableModule, 
    MatSortModule, 
    MatPaginatorModule, 
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  templateUrl: './clients.html',
  styleUrl: './clients.scss',
})
export class ClientsComponent implements OnInit, OnDestroy  {
  displayedColumns: string[] = ['row', 'name', 'client_code', 'no_linked_contacts', 'edit'];
  dataSource!: MatTableDataSource<Client>;
  private destroy$ = new Subject<void>();
  loading = signal(false);
  toastrService = inject(ToastrService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private readonly clientsServices = inject(ClientsServices)
  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.getAllClients()
  }

  getAllClients(): void {
    this.loading.set(true);
    this.clientsServices.getClients()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.dataSource = new MatTableDataSource<Client>(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.loading.set(false);
        },
        error: (error: Error) => {
          console.error(error);
          this.toastrService.error('Error in fetching clients', error.message);
          this.loading.set(false);
        }
      })
  }

  openDialog(client?: Client): void {
    const dialogRef = this.dialog.open(ClientDialog, {
      data: client,
      width: '400px',
      disableClose: true,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllClients()
      }
    });
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

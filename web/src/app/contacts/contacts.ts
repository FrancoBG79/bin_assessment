import { Component, inject, OnDestroy, signal, ViewChild } from '@angular/core';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs'
import { FieldsComponent } from '../fields/fields';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { Contact, ContactsService } from '../services/contacts';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ContactDialog } from './contact-dialog/contact-dialog';

@Component({
  selector: 'app-contacts',
  imports: [
    MatTabsModule, 
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
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
})
export class ContactsComponent implements OnDestroy {
  displayedColumns: string[] = ['id', 'name', 'surname', 'email', 'no_of_clients', 'edit'];
  dataSource!: MatTableDataSource<Contact>;
  private destroy$ = new Subject<void>();
  loading = signal(false);
  toastrService = inject(ToastrService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private readonly contactsService = inject(ContactsService);
  readonly dialog = inject(MatDialog);

  onTabChange(event: MatTabChangeEvent) {
    if (event.tab.textLabel === 'Contact(s)') {
      this.getAllContacts();
    }
  }

  getAllContacts() {
    this.loading.set(true);
    this.contactsService.getContacts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.dataSource = new MatTableDataSource<Contact>(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.loading.set(false);
        },
        error: (error: Error) => {
          console.error(error)
          this.toastrService.error('Error in fetching clients', error.message);
          this.loading.set(false);
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

  openDialog(contact?: Contact): void {
      const dialogRef = this.dialog.open(ContactDialog, {
        data: contact,
        width: '400px',
        disableClose: true,
        autoFocus: true
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getAllContacts()
        }
      });
    }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

import { Component, inject, signal, ViewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs'
import { FieldsComponent } from '../fields/fields';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { Contacts } from '../services/contacts';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

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
export class ContactsComponent {
  displayedColumns: string[] = ['id', 'name', 'surname', 'email', 'no_of_clients'];
  dataSource!: MatTableDataSource<Contacts>;
  private destroy$ = new Subject<void>();
  loading = signal(false);
  toastrService = inject(ToastrService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Contacts>([]);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

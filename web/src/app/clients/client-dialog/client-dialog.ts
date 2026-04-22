import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { Contact, ContactsService } from '../../services/contacts';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from '@angular/material/select';
import { MatOption } from "@angular/material/select";

interface ClientDialogData {
  clientId: string;
}

@Component({
  selector: 'app-create',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatOption
],
  templateUrl: './client-dialog.html',
  styleUrl: './client-dialog.scss',
})
export class ClientDialog implements OnInit, OnDestroy {
  readonly clientId = inject<ClientDialogData>(MAT_DIALOG_DATA)?.clientId;
  private destroy$ = new Subject<void>();
  loading = signal(false);
  toastrService = inject(ToastrService);
  private readonly contactsService = inject(ContactsService)

  clientForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
    client_code: new FormControl<string>({ value: '', disabled: true }),
    no_linked_contacts: new FormControl({ value: [], disabled: true })
  })

  contactsList: Contact[] = []

  ngOnInit(): void {
    this.getAllClients();
  }

  getAllClients(): void {
    this.loading.set(true);
    this.contactsService.getContacts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.contactsList = response;
          if (response.length > 0) {
            this.clientForm?.get('no_linked_contacts')?.enable();
          } else {
            this.clientForm?.get('no_linked_contacts')?.disable();
          }
            this.loading.set(false);
          },
        error: (error: Error) => {
          console.error(error);
          this.toastrService.error('Error in fetching clients', error.message);
          this.loading.set(false);
        }
      })
  }

  onSubmit() {
    this.loading.set(true);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

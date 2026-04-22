import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { Contact, ContactsService } from '../../services/contacts';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from '@angular/material/select';
import { MatOption } from "@angular/material/select";
import { Client, ClientsServices } from '../../services/clients';

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
  readonly clientData = inject<Client>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ClientDialog>);
  private destroy$ = new Subject<void>();
  loading = signal(false);
  toastrService = inject(ToastrService);
  title = 'Add'
  private readonly contactsService = inject(ContactsService)
  private readonly clientsServices = inject(ClientsServices)
  clientForm = new FormGroup({
    id: new FormControl<string>(''),
    name: new FormControl<string>('', [Validators.required]),
    client_code: new FormControl<string>({ value: 'ABC001', disabled: true }),
    no_linked_contacts: new FormControl<string[]>({ value: [], disabled: true })
  })

  contactsList: Contact[] = []

  ngOnInit(): void {
    this.getAllClients();
    if (this.clientData) {
      this.title = 'Edit';
      this.clientForm.patchValue(this.clientData)
    } 
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
    const form = this.clientForm.getRawValue() as unknown as Client;
    console.log('submit client', this.clientData)
    if (this.clientData) {
      this.clientsServices.putClient(form)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.dialogRef.close(response);
            this.loading.set(false);
          },
          error: (error: Error) => {
            console.error(error);
            this.toastrService.error('Error in updating client', error.message);
            this.loading.set(false);
          }
        });
    } else {
      console.log('post')
      this.clientsServices.postClient(form)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.dialogRef.close(response);
            this.loading.set(false);
          },
          error: (error: Error) => {
            console.error(error);
            this.toastrService.error('Error in updating client', error.message);
            this.loading.set(false);
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

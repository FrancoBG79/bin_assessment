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
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from '@angular/material/select';
import { MatOption } from "@angular/material/select";
import { Client, ClientsServices } from '../../services/clients';
import { email } from '@angular/forms/signals';
import { Contact, ContactsService } from '../../services/contacts';

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
  templateUrl: './contact-dialog.html',
  styleUrl: './contact-dialog.scss',
})
export class ContactDialog implements OnInit, OnDestroy {
  readonly contactData = inject<Contact>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ContactDialog>);
  title = 'Add'
  private destroy$ = new Subject<void>();
  loading = signal(false);
  toastrService = inject(ToastrService);

  contactForm = new FormGroup({
    id: new FormControl<string>(''),
    name: new FormControl<string>('', [Validators.required]),
    surname: new FormControl<string>('', [Validators.required]),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    no_of_clients: new FormControl<string[]>({ value: [], disabled: true })
  });

  clientsList: Client[] = []

  private readonly clientsServices = inject(ClientsServices)
  private readonly contactsService = inject(ContactsService)
  ngOnInit(): void {
    this.getAllContacts();
    if (this.contactData) {
      this.title = 'Edit';
      this.contactForm.patchValue(this.contactData)
    } 
  }

  getAllContacts() {
    this.loading.set(true);
    this.clientsServices.getClients()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.clientsList = response;
          if (response.length > 0) {
            this.contactForm?.get('no_of_clients')?.enable();
          } else {
            this.contactForm?.get('no_of_clients')?.disable();
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
    console.log('contact dialog submit')
    this.loading.set(true);
    const form = this.contactForm.getRawValue() as unknown as Contact;
    if (this.contactData) {
      this.contactsService.putContact(form)
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
      this.contactsService.postContact(form)
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

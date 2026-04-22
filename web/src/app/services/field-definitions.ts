import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface FieldDefinitions {
  id: string;
  description: string;
  field_type: string;
  compulsory: boolean;
  additional_information: string;
  for_entity?: string;
}

@Injectable({
  providedIn: 'root',
})
export class FieldDefinitionsService {
  private readonly apiUrl = environment.apiUrl;
  private readonly httpClient = inject(HttpClient);

  getFieldDefinitions(entity: string): Observable<FieldDefinitions[]> {
    return this.httpClient.get<FieldDefinitions[]>(`${this.apiUrl}/fields`, {
      params: { entity }, observe: 'response'
    }).pipe(
      map((response: HttpResponse<FieldDefinitions[]>) => {
        return response.body ?? [];
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); })
    )
  }
}

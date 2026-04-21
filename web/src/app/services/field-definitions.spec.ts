import { TestBed } from '@angular/core/testing';

import { FieldDefinitions } from './field-definitions';

describe('FieldDefinitions', () => {
  let service: FieldDefinitions;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FieldDefinitions);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

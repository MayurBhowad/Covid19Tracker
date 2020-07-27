import { TestBed } from '@angular/core/testing';

import { DataAPIServiceService } from './data-apiservice.service';

describe('DataAPIServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataAPIServiceService = TestBed.get(DataAPIServiceService);
    expect(service).toBeTruthy();
  });
});

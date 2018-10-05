import { TestBed } from '@angular/core/testing';

import { UnitsStorageService } from './units-storage.service';

describe('UnitsStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UnitsStorageService = TestBed.get(UnitsStorageService);
    expect(service).toBeTruthy();
  });
});

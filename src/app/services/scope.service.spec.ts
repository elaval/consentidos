import { TestBed } from '@angular/core/testing';

import { ScopeService } from './scope.service';

describe('ScopeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScopeService = TestBed.get(ScopeService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { NavigatorsService } from './navigators.service';

describe('NavigatorsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NavigatorsService = TestBed.get(NavigatorsService);
    expect(service).toBeTruthy();
  });
});

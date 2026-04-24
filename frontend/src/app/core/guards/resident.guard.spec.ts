import { TestBed } from '@angular/core/testing';

import { ResidentGuard } from './resident.guard';

describe('ResidentGuard', () => {
  let guard: ResidentGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ResidentGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

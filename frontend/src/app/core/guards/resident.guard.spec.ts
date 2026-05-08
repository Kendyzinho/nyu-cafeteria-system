import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { ResidentGuard } from './resident.guard';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user';

describe('ResidentGuard', () => {
  let guard: ResidentGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['getCurrentUser']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        ResidentGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    guard = TestBed.inject(ResidentGuard);
  });

  it('allows resident users', () => {
    const user = { isResident: true } as User;
    authServiceSpy.getCurrentUser.and.returnValue(user);

    expect(guard.canActivate()).toBeTrue();
  });

  it('redirects non-resident users to home', () => {
    const user = { isResident: false } as User;
    authServiceSpy.getCurrentUser.and.returnValue(user);

    expect(guard.canActivate()).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });
});

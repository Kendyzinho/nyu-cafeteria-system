import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { GuestGuard } from './guest.guard';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user';

describe('GuestGuard', () => {
  let guard: GuestGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', [
      'isAuthenticated',
      'getCurrentUser',
    ]);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        GuestGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    guard = TestBed.inject(GuestGuard);
  });

  it('allows access for unauthenticated users', () => {
    authServiceSpy.isAuthenticated.and.returnValue(false);

    expect(guard.canActivate()).toBeTrue();
  });

  it('redirects authenticated students to home', () => {
    authServiceSpy.isAuthenticated.and.returnValue(true);
    authServiceSpy.getCurrentUser.and.returnValue({ role: 'Cliente' } as User);

    expect(guard.canActivate()).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('redirects authenticated admins to admin users', () => {
    authServiceSpy.isAuthenticated.and.returnValue(true);
    authServiceSpy.getCurrentUser.and.returnValue({ role: 'Administrador' } as User);

    expect(guard.canActivate()).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/users']);
  });
});

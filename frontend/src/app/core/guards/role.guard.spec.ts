import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { RoleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['getCurrentUser']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        RoleGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    guard = TestBed.inject(RoleGuard);
  });

  it('allows admin users', () => {
    const user = { role: 'Administrador' } as User;
    authServiceSpy.getCurrentUser.and.returnValue(user);

    expect(guard.canActivate()).toBeTrue();
  });

  it('blocks non-admin users', () => {
    const user = { role: 'Cliente' } as User;
    authServiceSpy.getCurrentUser.and.returnValue(user);

    expect(guard.canActivate()).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });
});

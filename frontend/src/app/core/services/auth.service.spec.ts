import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  function buildToken(expOffsetSeconds: number): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + expOffsetSeconds }));
    return `${header}.${payload}.signature`;
  }

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('returns true when token is valid', () => {
    localStorage.setItem('jwt_token', buildToken(3600));

    expect(service.isAuthenticated()).toBeTrue();
  });

  it('returns false and clears storage when token is expired', () => {
    localStorage.setItem('jwt_token', buildToken(-10));
    localStorage.setItem('current_user', JSON.stringify({ id: 1 }));

    expect(service.isAuthenticated()).toBeFalse();
    expect(localStorage.getItem('jwt_token')).toBeNull();
    expect(localStorage.getItem('current_user')).toBeNull();
  });
});

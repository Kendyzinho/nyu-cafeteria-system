import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMessage {
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toast$ = new Subject<ToastMessage>();

  show(message: string, type: 'success' | 'danger' | 'warning' | 'info' = 'success') {
    this.toast$.next({ message, type });
  }
}

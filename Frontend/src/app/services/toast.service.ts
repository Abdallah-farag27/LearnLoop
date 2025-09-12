// toast.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
  dismissing?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private addToast(toast: Omit<Toast, 'id'>) {
    const newToast: Toast = {
      id: this.generateId(),
      duration: 5000,
      dismissible: true,
      ...toast
    };

    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, newToast]);

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        this.dismiss(newToast.id);
      }, newToast.duration);
    }
  }

  success(message: string, title?: string, options?: Partial<Toast>) {
    this.addToast({
      type: 'success',
      message,
      title,
      ...options
    });
  }

  error(message: string, title?: string, options?: Partial<Toast>) {
    this.addToast({
      type: 'error',
      message,
      title,
      ...options
    });
  }

  warning(message: string, title?: string, options?: Partial<Toast>) {
    this.addToast({
      type: 'warning',
      message,
      title,
      ...options
    });
  }

  info(message: string, title?: string, options?: Partial<Toast>) {
    this.addToast({
      type: 'info',
      message,
      title,
      ...options
    });
  }

  dismiss(id: string) {
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next(currentToasts.filter(toast => toast.id !== id));
  }

  clear() {
    this.toastsSubject.next([]);
  }
}
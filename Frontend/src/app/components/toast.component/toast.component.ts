// toast-container.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Toast, ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: `./toast.component.html`,
  styleUrls: ['./toast.component.css']
})
export class ToastContainerComponent implements OnInit {
  toasts$!: Observable<Toast[]>;

  constructor(private toastService: ToastService) { }

  ngOnInit() {
    this.toasts$ = this.toastService.toasts$;
  }

  dismissToast(id: string) {
    this.toastService.dismiss(id);
  }

  trackByToast(index: number, toast: Toast): string {
    return toast.id;
  }
}
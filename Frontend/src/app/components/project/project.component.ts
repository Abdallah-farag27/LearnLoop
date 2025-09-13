// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-project.component',
//   imports: [],
//   templateUrl: './project.component.html',
//   styleUrl: './project.component.css'
// })
// export class ProjectComponent {

// }
// any-component.ts
import { Component } from '@angular/core';
import { ToastService } from '@shared/services/toast.service';

@Component({
  template: `
    <button (click)="showSuccess()" class="bg-green-500 text-white px-4 py-2 rounded">
      Show Success
    </button>
    <button (click)="showError()" class="bg-red-500 text-white px-4 py-2 rounded ml-2">
      Show Error
    </button>
  `
})
export class ProjectComponent {
  constructor(private toastService: ToastService) { }

  showSuccess() {
    this.toastService.success('Operation completed successfully!', 'Success');
  }

  showError() {
    this.toastService.error('Something went wrong!', 'Error');
  }
}
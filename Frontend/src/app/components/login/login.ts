import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { z } from 'zod';
import { AuthService } from '@shared/services/auth.service';
import { RouterModule, Router } from '@angular/router';
import { ToastService } from '@shared/services/toast.service';

// Zod schema for validation
const loginSchema = z.object({
  email: z.string()
    .email('Please enter a valid email')
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(5, 'Password must be at least 5 characters'),
})

type loginForm = z.infer<typeof loginSchema>;

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginForm: FormGroup;
  isSubmitting = false;
  submitError = '';
  submitSuccess = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private toast: ToastService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return `${fieldName} is required`;
    if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
    if (field.errors['email']) return 'Please enter a valid email address';

    return 'Invalid input';
  }

  onSubmit(): void {
    console.log(123123);
    if (this.loginForm.invalid) {
      console.log(456456);
      this.markAllFieldsAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';
    this.submitSuccess = false;

    try {
      // Validate with Zod
      const formData = loginSchema.parse(this.loginForm.value);

      // Remove confirmPassword before processing
      const { ...loginData } = formData;
      console.log('Login Data:', loginData);


      this.authService.login(loginData).subscribe({
        next: (response) => {
          console.log("The login response : ", response);


          this.isSubmitting = false;
          this.submitSuccess = true;
          this.loginForm.reset();
          this.toast.success('Login successfully!', 'Success');

          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.submitSuccess = false;
          this.loginForm.reset();

          this.toast.error(err.error?.message || 'Log in failed', "Failed");
        },
      });



    } catch (error: any) {
      if (error.errors) {
        this.submitError = error.errors[0]?.message || 'Validation failed';
      } else {
        this.submitError = 'Log in failed. Please try again.';
      }
      this.isSubmitting = false;
    }
  }

  private markAllFieldsAsTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }

  // Custom validator for password confirmation (alternative to Zod)
  passwordMatchValidator = (formGroup: FormGroup) => {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else if (confirmPassword?.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }

    return null;
  }

  // Method to get form data (useful for testing)
  getFormData() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      const { confirmPassword, ...userData } = formData;
      return userData;
    }
    return null;
  }

  // Method to reset form
  resetForm() {
    this.loginForm.reset();
    this.submitError = '';
    this.submitSuccess = false;
    this.isSubmitting = false;
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { z } from 'zod';
import { AuthService } from '@shared/services/auth.service';
import { RouterModule, Router } from '@angular/router';
import { ToastService } from '@shared/services/toast.service';
// Zod schema for validation
const registrationSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .trim(),
  email: z.string()
    .email('Please enter a valid email')
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(5, 'Password must be at least 5 characters'),
  confirmPassword: z.string(),
  role: z.enum(['admin', 'user']).default('user')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegistrationForm = z.infer<typeof registrationSchema>;

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  registrationForm: FormGroup;
  isSubmitting = false;
  submitError = '';
  submitSuccess = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, public toast: ToastService) {
    this.registrationForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', [Validators.required]],
      role: ['user']
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registrationForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getFieldError(fieldName: string): string {
    const field = this.registrationForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return `${fieldName} is required`;
    if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
    if (field.errors['email']) return 'Please enter a valid email address';

    return 'Invalid input';
  }

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      this.markAllFieldsAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';
    this.submitSuccess = false;

    try {
      // Validate with Zod
      const formData = registrationSchema.parse(this.registrationForm.value);

      // Remove confirmPassword before processing
      const { confirmPassword, ...registrationData } = formData;
      console.log('Registration Data:', registrationData);

      this.authService.signup(registrationData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.submitSuccess = true;
          this.registrationForm.reset();
          this.router.navigate(['/login']);
          this.toast.success('User Signed Up successfully!', 'Success');
        },
        error: (err) => {
          this.isSubmitting = false;
          this.toast.error(err.error?.message || 'Signup failed', "Failed");
        },
      });

    } catch (error: any) {
      if (error.errors) {
        this.submitError = error.errors[0]?.message || 'Validation failed';
      } else {
        this.submitError = 'Registration failed. Please try again.';
      }
      this.isSubmitting = false;
    }
  }

  private markAllFieldsAsTouched() {
    Object.keys(this.registrationForm.controls).forEach(key => {
      this.registrationForm.get(key)?.markAsTouched();
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
    if (this.registrationForm.valid) {
      const formData = this.registrationForm.value;
      const { confirmPassword, ...userData } = formData;
      return userData;
    }
    return null;
  }

  // Method to reset form
  resetForm() {
    this.registrationForm.reset();
    this.submitError = '';
    this.submitSuccess = false;
    this.isSubmitting = false;
  }
}
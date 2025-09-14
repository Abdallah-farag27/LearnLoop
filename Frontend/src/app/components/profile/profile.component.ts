import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '@shared/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {

  user: User | null = null;
  editing = false;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;  // ✅ already the User object
      console.log('profile detected user change:', this.user);
    });
  }


  toggleEdit() {
    this.editing = !this.editing;
  }

  saveChanges() {
    if (this.user) {
      console.log("Saving Changes ", this.user);
      this.authService.updateUser(this.user).subscribe({
        next: (res) => {
          this.user = res;
          this.editing = false;
        },
        error: (err) => {
          console.error('Update failed:', err);
        },
      });
    }
  }
}

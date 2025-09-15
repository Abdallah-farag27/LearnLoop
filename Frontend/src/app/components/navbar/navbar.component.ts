import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService, User } from '@shared/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isMobileMenuOpen = false;
  user: User | null = null;

  constructor(private router: Router, public authService: AuthService) { }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }
  ngOnInit() {
    // subscribe to user changes
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }
  navigateToRegister() {
    this.closeMobileMenu();
    this.router.navigate(['/register']);
  }


  alLogout() {
    this.authService.logout();
    this.closeMobileMenu();
  }

}
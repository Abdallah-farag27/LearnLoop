import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserContextService {
  private user: any = null;

  setUser(userData: any) {
    this.user = userData;
  }

  getUser() {
    return this.user;
  }

  clearUser() {
    this.user = null;
  }
}

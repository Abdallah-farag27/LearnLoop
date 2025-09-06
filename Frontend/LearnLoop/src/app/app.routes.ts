import { Routes } from '@angular/router';
import { RegistrationComponent } from './components/registration/registration.component';
import { Login } from './components/login/login';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "home", component: HomeComponent, title: "Home" },
    { path: "register", component: RegistrationComponent, title: "Registration" },
    { path: "login", component: Login, title: "Log in" },
    { path: "**", redirectTo: "/home" } // Wildcard route for 404 page
];
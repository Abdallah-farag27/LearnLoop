import { Routes } from '@angular/router';
import { RegistrationComponent } from './components/registration/registration.component';
import { Login } from './components/login/login';
import { HomeComponent } from './components/home/home.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { ProjectComponent } from './components/project/project.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "home", component: HomeComponent, title: "Home" },
  { path: "register", component: RegistrationComponent, title: "Registration" },
  { path: "login", component: Login, title: "Log in" },
  { path: "projects", component: ProjectComponent, title: "Projects" },
  { path: "profile", component: ProfileComponent, title: "Profile" },
  { path: "projects/:projectId/tasks", component: TasksComponent },
  { path: "**", redirectTo: "/home" } // Wildcard route for 404 page
];

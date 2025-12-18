import { Routes } from '@angular/router';
import { RegistrationComponent } from './components/registration/registration.component';
import { Login } from './components/login/login';
import { HomeComponent } from './components/home/home.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AdminProjectsComponent } from './components/projects/admin-projects/admin-projects.component';
import { ProjectFormComponent } from './components/projects/project-form/project-form.component';
import { ProjectDetailComponent } from './components/projects/project-detail/project-detail.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component'
import { FaqComponent } from './components/faq/faq.component';




export const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "home", component: HomeComponent, title: "Home" },
  { path: "register", component: RegistrationComponent, title: "Registration" },
  { path: "login", component: Login, title: "Log in" },
  { path: 'projects', component: AdminProjectsComponent, title: "Projects" },
  { path: 'projects/new', component: ProjectFormComponent, title: "Create a Project" },
  { path: 'projects/:id', component: ProjectDetailComponent, title: "Project Details" },
  { path: "profile", component: ProfileComponent, title: "Profile" },
  { path: "projects/:projectId/tasks", component: TasksComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'about', component: AboutComponent },
  { path: 'faq', component: FaqComponent },
  { path: "**", redirectTo: "/home" } // Wildcard route for 404 page
];

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Project, ProjectService } from '@shared/services/projects.service';

@Component({
  selector: 'app-admin-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-projects.component.html'
})
export class AdminProjectsComponent implements OnInit {
  adminProjects$!: Observable<Project[]>;

  constructor(private projectService: ProjectService, private router: Router) { }

  ngOnInit(): void {
    this.adminProjects$ = this.projectService.getProjectsByCurrentAdmin();
  }

  openAddForm() {
    this.router.navigate(['/projects/new']);
  }

  openDetails(id: string) {
    this.router.navigate(['/projects', id]);
  }
}

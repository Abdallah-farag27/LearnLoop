import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from './components/login/login';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Login, HomeComponent, AboutComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('LearnLoop');
}

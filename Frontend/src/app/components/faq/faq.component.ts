import { Component } from '@angular/core';
      import { Router } from '@angular/router';

      @Component({
        selector: 'app-faq',
        templateUrl: './faq.component.html',
        styleUrls: ['./faq.component.css']
      })
      export class FaqComponent {
        constructor(private router: Router) {}

        goToHome() {
          this.router.navigateByUrl('/');
        }
      }

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent implements OnInit{
  firstname: string = '';

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.firstname = this.route.snapshot.queryParams['firstname'];
  }
  
  logout() {
    sessionStorage.removeItem('loggedInUser');
    this.router.navigate(['/login']); // Redirect to login page
  }
}


import { Component, OnInit } from '@angular/core';
import { simpleFade } from '../../../animations/element-animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  animations: [simpleFade],
})
export class LandingComponent implements OnInit {

  constructor(private router: Router){}

  ngOnInit(): void {

    const storedUser = localStorage.getItem('loggedInUser');
    if(storedUser){
      this.router.navigate(['main']);
    }
  }
}

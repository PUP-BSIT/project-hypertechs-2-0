import { Component } from '@angular/core';
import { simpleFade } from '../../../animations/element-animations';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  animations: [simpleFade],
})
export class LandingComponent {}

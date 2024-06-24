import { Component } from '@angular/core';
import { simpleFade, slideInOut } from '../../../../animations/element-animations';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  animations: [simpleFade, slideInOut]
})
export class SearchComponent {

}

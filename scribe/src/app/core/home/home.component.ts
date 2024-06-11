import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { UserService } from '../../../services/user.service';
import { TitleCaseService } from '../../../services/title-case.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @Input() firstname: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private titleCaseService: TitleCaseService
  ) { }

  ngOnInit() {
    this.userService.firstname$.subscribe(firstname => {
      this.firstname = this.titleCaseService.toTitleCase(firstname);
    });
  }
}

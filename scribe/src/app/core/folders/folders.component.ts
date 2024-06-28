import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-folders',
  templateUrl: './folders.component.html',
  styleUrls: ['./folders.component.scss'],
})
export class FoldersComponent implements OnInit {
  folders = [
    { name: 'Folder 1' },
    { name: 'Folder 2' },
    { name: 'Folder 3' },
    { name: 'Folder 4' }
  ];

  filters = ['All', 'Recent', 'Shared'];
  selectedFilter = 'All';
  isGridView: boolean = true;

  constructor() { }

  ngOnInit(): void { }

  toggleView(event: any): void {
    this.isGridView = event.value === 'grid';
  }
}
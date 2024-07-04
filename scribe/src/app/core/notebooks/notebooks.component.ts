import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notebooks',
  templateUrl: './notebooks.component.html',
  styleUrl: './notebooks.component.scss'
})
export class NotebooksComponent implements OnInit {
  notebooks = [
    { name: 'Notebook 1' },
    { name: 'Notebook 2' },
    { name: 'Notebook 3' },
    { name: 'Notebook 4' },
    { name: 'Notebook 5' },
    { name: 'Notebook 6' },
    { name: 'Notebook 7' },
    { name: 'Notebook 8' }
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

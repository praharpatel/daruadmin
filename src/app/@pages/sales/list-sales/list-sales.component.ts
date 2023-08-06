import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-sales',
  templateUrl: './list-sales.component.html',
  styleUrls: ['./list-sales.component.scss']
})
export class ListSalesComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    // this.breadCrumbItems = [{ label: 'Ventas' }, { label: 'Ventas', active: true }];
    this.breadCrumbItems = [{ label: 'Ventas', active: true }];

  }

}

import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css']
})

/**
 * reusable component for breadcrumbs
 */
export class BreadcrumbsComponent implements OnInit {


  // sub items =  [ {label: Label to display, url: URL route}]
  @Input() items: any[];

  // home =  {label: Label to display, url: URL route}
  @Input() home: any;

  constructor() { }

  ngOnInit() {
  }

}

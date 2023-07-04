import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-data-not-found',
  templateUrl: './data-not-found.component.html',
  styleUrls: ['./data-not-found.component.css']
})

/**
 * static component to display Data Not found message
 */
export class DataNotFoundComponent implements OnInit {

  // loader
  @Input() appLoader?;

  // alignment
  @Input() alignClass ? = 'text-left';

  // font size
  @Input() fontSize ? = 'font-size-14';

  constructor() {
  }

  ngOnInit() {
  }
}


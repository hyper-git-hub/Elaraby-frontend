import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-map-overlay',
  templateUrl: './map-overlay-component.component.html',
  styleUrls: ['./map-overlay-component.component.css']
})

/**
 * Overlay messages on display over google map
 */
export class MapOverlayComponentComponent implements OnInit {

  // boolean visibility
  @Input() visibility;

  // top margin
  @Input() top ? = 25;

  // msg to display
  @Input() msg;
  constructor() { }

  ngOnInit() {
  }
}

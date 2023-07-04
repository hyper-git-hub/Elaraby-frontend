import {Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-iop',
  templateUrl: './iop.component.html',
  styleUrls: ['./iop.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class IopComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
    // $.getJSON('http://gd.geobytes.com/GetCityDetails?callback=?', function(data) {
    //   localStorage.setItem('clientIP', data.geobytesipaddress);
    // });
  }

}

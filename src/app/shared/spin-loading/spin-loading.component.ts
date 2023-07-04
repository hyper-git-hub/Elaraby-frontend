import {Component, Input, OnInit} from '@angular/core';
import {isNullOrUndefined} from 'util';
import {AppLoader} from '../../core/utils/app-loader';

@Component({
  selector: 'app-spin-loading',
  templateUrl: './spin-loading.component.html',
  styleUrls: ['./spin-loading.component.css']
})


/**
 * spinning loader which is shown/hidden on a boolean flag
 * mostly AppLoader
 */
export class SpinLoadingComponent implements OnInit {

// apploader
  @Input() appLoader?: AppLoader;

  // size of spinner
  @Input() size?;

  // marginTop
  @Input() marginTop ? = 'auto';

  // size
  dimension = '50px';


  constructor() {
  }

  ngOnInit() {

    if (!isNullOrUndefined(this.size) && this.size === 'sm') {
      this.dimension = '30px';
    }
  }

}

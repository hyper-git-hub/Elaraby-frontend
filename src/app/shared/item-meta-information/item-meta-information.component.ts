import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../../iop/model/item';

@Component({
  selector: 'app-item-meta-information',
  templateUrl: './item-meta-information.component.html',
  styleUrls: ['./item-meta-information.component.css']
})

/**
 * displays meta information block
 */
export class ItemMetaInformationComponent implements OnInit {

  // list of key,value items
  @Input() list: Item[] = [];

  // name of entity
  @Input() name: string;

  // image of entity
  @Input() image: any;

  // show badge
  @Input() showBadge?: any;

  // statuses to be shown as badge.
  // {label: label to display, class:badgeColor}
  @Input() status?: any = [];

  // height of the div
  @Input() height?: any;

  // show signals
  @Input() showSignals?: any;

  // value for signal
  @Input() signalsStrength: any;

  constructor() {
  }

  ngOnInit() {
    setTimeout(() =>
      console.log("list============== ", this.list)
      , 1000)

  }


  /**
   * displays signals strength according to the value.
   */
  getSignalsClasses() {
    // this.signalsStrength = -70;
    // console.log(this.signalsStrength);
    if (this.signalsStrength >= -88 && this.signalsStrength <= -78) {
      return 'waveStrength-1';
    } else if (this.signalsStrength >= -77 && this.signalsStrength <= -67) {
      return 'waveStrength-2';
    } else if (this.signalsStrength >= -66 && this.signalsStrength <= -56) {
      return 'waveStrength-3';
    } else if (this.signalsStrength >= -55) {
      return 'waveStrength-4';
    } else {
      return 'waveStrength-0';
    }
  }

  getBarSignalsClasses() {
    // console.log(this.signalsStrength);
    if (this.signalsStrength >= -88 && this.signalsStrength <= -78) {
      return 'uniform one-bar';
    } else if (this.signalsStrength >= -77 && this.signalsStrength <= -67) {
      return 'uniform two-bars';
    } else if (this.signalsStrength >= -66 && this.signalsStrength <= -56) {
      return 'uniform three-bars';
    } else if (this.signalsStrength <= -55) {
      return 'uniform four-bars';
    } else {
      return 'no-bars';
    }
  }

}

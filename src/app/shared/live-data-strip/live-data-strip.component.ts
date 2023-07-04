import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeviceStateEnum } from '../../iop/model/device-state.enum';
declare var $: any;
@Component({
  selector: 'app-live-data-strip',
  templateUrl: './live-data-strip.component.html',
  styleUrls: ['./live-data-strip.component.css']
})
/**
 * live data strips which updates with every packet
 */
export class LiveDataStripComponent implements OnInit {

  // packet
  @Input() signalRresponse;

  DeviceStateEnum = DeviceStateEnum;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    console.log("signalRresponse(inside live data strip)= ", this.signalRresponse);
  }


}

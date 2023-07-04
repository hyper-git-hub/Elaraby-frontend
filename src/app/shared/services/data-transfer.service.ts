import {EventEmitter, Injectable, Output} from '@angular/core';


/**
 * A service used to transfer data between header component & profile component.
 * Listen to the changes made in profile component  & uodates the header component
 */
@Injectable()
export class DataTransferService {


  public data: any;
  @Output() dataUpdated: EventEmitter<any> = new EventEmitter();

  constructor() {
  }


  /**
   * Sets the data to the provided value
   * @param data: data to set
   */
  setData(data) {
    this.data = data;
    this.dataUpdated.emit(data);
  }

  getData() {
    return this.data;
  }
}

import { Pipe, PipeTransform } from '@angular/core';
// import {isNullOrUndefined} from 'util';

@Pipe({
  name: 'StatusConvertPipe'
})


/**
 * returns Online/Offline for true/false
 */

export class StatusConvertPipe implements PipeTransform {

  transform(value: any): any {
    if(value) return 'Online';
    return 'Offline';
  }

}
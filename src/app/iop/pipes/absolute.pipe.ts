import { Pipe, PipeTransform } from '@angular/core';
import {isNullOrUndefined} from 'util';

@Pipe({
  name: 'absolute'
})


/**
 * returns absolute of any input value
 */
export class AbsolutePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(!isNullOrUndefined(value)) return Math.abs(value);
    return null;
  }

}

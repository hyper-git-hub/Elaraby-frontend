import { Pipe, PipeTransform } from '@angular/core';
import {isNullOrUndefined} from 'util';

@Pipe({
  name: 'getNullOrUndefined'
})

/***
 * if the input value is numm or undefined it returns '-'
 */
export class GetNullorUndefinedPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!isNullOrUndefined(value) &&  value !== '') {
      return value;
    }
    return '-';
  }


}

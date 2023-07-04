import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertToPassword'
})


/***
 * returns *** in place of a password
 */
export class ConvertPasswordPipe implements PipeTransform {


  transform(value: any, args?: any): any {
    return '******';
  }

}

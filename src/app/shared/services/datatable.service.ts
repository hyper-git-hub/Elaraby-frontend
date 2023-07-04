import { Injectable } from '@angular/core';
import {isNullOrUndefined} from 'util';

/**
 * Search in datatable helper service. Extends the ngx-datatable search mechanism
 */
@Injectable()
export class DatatableService {

  temp: any[];

  constructor() {
  }

  /**
   * Search the given keyword in a given array. returns the items that matches the criteria.
   * @param value: keyword to search
   * @param data: array of objects to search in
   * @param args: list of fields to search in. by default the param is name
   * This method performs an OR operation while searching for the keyword in the given field
   */
  updateFilter(value, data, args = ['name']) {
    let temp = [];
    let condition;
    if (isNullOrUndefined(value)) {
      return data;
    }
    // transform the input value in lower case.
    const val = value.toString().toLowerCase();

    temp = data.filter(item => {
      // ensure that arg is not null and that the first args exists in the array
      if (args[0] in item && !isNullOrUndefined(item[args[0]])) {
        condition = item[args[0]].toString().toLowerCase().indexOf(val) >= 0;
      } else {
        condition = false;
      }

      // checks the rest of the keywords args in array and applies OR result for each result
      if (args.length > 1) {
        for (let i = 1; i < args.length; i++) {
          if (args[i] in item ) {
            if (!isNullOrUndefined(item[args[i]])) {
              condition = condition || (item[args[i]].toString().toLowerCase().indexOf(val) >= 0);
            }
          }
        }
      }
      return condition;
    });
    return temp;
  }

  /**
   * Can be used to apply multiple filters on a single data set.
   * For e.g. a user may wants to search a car with blue color and honda model. not a car with only blue color or Honda model.
   * @param array data to search from
   * @param filters {color: blue, model: Honda}
   */
  myMultiFilter(array, filters) {
    const filterKeys = Object.keys(filters);

    const c =  array.filter((item) => {
      const b = filterKeys.every((key) => {
        if (!(key in item)){return false; }
        else {
          if (typeof (item[key]) === 'string') {
            return (item[key].toLowerCase().indexOf(filters[key].toLowerCase()) > -1);
          } else {
            return (item[key] === filters[key]);
          }
        }
      });
      return b;

    });
    return c;

  }


}

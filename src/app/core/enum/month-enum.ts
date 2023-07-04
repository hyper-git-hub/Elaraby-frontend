/**
 * List of all months
 */
export enum MonthEnum {
  January = 1,
  Febuary = 2,
  March = 3,
  April = 4,
  May = 5,
  June = 6,
  July = 7,
  August = 8,
  September = 9,
  October = 10,
  November = 11,
  December = 12,
}


/**
 * Can be used in a dropdown with all the months
 */
export class MonthDropdown {

  allOption = {label: 'All'};

  static getMonthDropdown(min = 2) {
    return  [
      {label: 'January', value: MonthEnum.January},
      {label: 'Febuary', value: MonthEnum.Febuary},
      {label: 'March', value: MonthEnum.March},
      {label: 'April', value: MonthEnum.April},
      {label: 'May', value: MonthEnum.May},
      {label: 'June', value: MonthEnum.June},
      {label: 'July', value: MonthEnum.July},
      {label: 'August', value: MonthEnum.August},
      {label: 'September', value: MonthEnum.September},
      {label: 'October', value: MonthEnum.October},
      {label: 'November', value: MonthEnum.November},
      {label: 'December', value: MonthEnum.December},
    ];
  }
}

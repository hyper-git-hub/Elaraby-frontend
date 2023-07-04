import { format, addMinutes, subWeeks, endOfMonth, subDays, subMonths, startOfToday, endOfToday, isValid, endOfYesterday } from 'date-fns';
import { isNullOrUndefined } from 'util';


/**
 * Utility that performs various dates operation.
 * Uses most of date-fns methods
 */

export class DateUtils {

  static now(): Date {
    return new Date();
  }

  static isValid(date: any): Boolean {
    return isValid(new Date(date));
  }

  static getEndOfMonth(date) {
    return endOfMonth(new Date(date));
  }

  static getMMMMDY(date: string) {
    return format(date, 'MMM DD, YYYY');

  }

  /**
   * Transform UTC date to Local date in the format (YYYYMMDDHHmmss)
   * @param date: date to format
   */
  static getLocalYYYYMMDDHHmmss(date: string): string {
    if (date) {
      date = date.replace('+00:00', '');
      try {
        const utcDate = Date.parse(date);
        const localDate = addMinutes(utcDate, -(new Date().getTimezoneOffset()));
        return format(localDate, 'YYYY-MM-DD HH:mm:ss');
      } catch (e) {
        console.log(e);
      }
    }
    return '';
  }

  /**
   * Transform UTC date to Local date in the format (hhmmA)
   * @param date: date to format
   */
  static getLocalhhmmA(date: string): string {
    if (date) {
      if (!date.includes('Z')) {
        date = date + 'Z';
      }
      date = date.replace('+00:00', '');
      try {

        const localDate = new Date(date);
        // const utcDate = Date.parse(date);
        // const localDate = addMinutes(utcDate, -(new Date().getTimezoneOffset()));
        // console.log(date , localDate);
        return format(localDate, 'hh:mm A');
      } catch (e) {
        console.log(e);
      }
    }
    return '';
  }

  static hrs12(date: string) {
    return format(date, 'hh:mm A');
  }



  static subtractDay(date, days) {
    // tslint:disable-next-line:prefer-const

    date = subDays(date, days);
    return format(date, 'YYYY-MM-DD');
    // '2020-02-19'
  }

  static utcToLocalTime(date: string): string {
    const localDate = new Date(date);
    // console.log(date, ': ' , localDate);
    return format(localDate, 'hh:mm A');
  }

  /**
   * Transform UTC date to Local date in the format (MMDDYYYYhhmmssA)
   * @param date: date to format
   */

  // input utc as '2017-12-04 07:23:56+00:00' or any valid parseable date as string
  // out local as '2017-12-04 02:23:56'
  static getLocalMMDDYYYYhhmmssA(date: string): string {
    if (date) {
      date = date.replace('+00:00', '');
      try {
        const utcDate = Date.parse(date);
        const localDate = addMinutes(utcDate, -(new Date().getTimezoneOffset()));
        return format(localDate, 'MMM, DD, YYYY, hh:mm:ss A');
      } catch (e) {
        console.log(e);
      }
    }
    return '';
  }


  /**
   * Transform UTC date to Local date in the format (MMDDYYYYhhmmssA)
   * @param date: date to format
   */
  // input utc as '2017-12-04 07:23:56+00:00' or any valid parseable date as string
  // out local as '2017-12-04 02:23:56'
  static getLocalMMDDYYYYhhmmssAwithDay(date: string): string {
    if (date) {
      date = date.replace('+00:00', '');
      const options = {
        weekday: 'long', year: 'numeric', month: 'long',
        day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'
      };
      try {
        const utcDate = Date.parse(date);
        const localDate = addMinutes(utcDate, -(new Date().getTimezoneOffset()));
        // return format(localDate, 'MMM, DD, YYYY, hh:mm:ss A');
        return localDate.toLocaleDateString('en-EN', options);
      } catch (e) {
        console.log(e);
      }
    }
    return '';
  }

  /**
   * Transform Local date to UTC date in the format (YYYYMMDDHHmmsstemp)
   * @param date: date to format
   */
  // input local as '2017-12-04 02:23:56' or any valid parseable date as string
  // out utc as '2017-12-04 07:23:56'  2018-01-01T01:00
  static getUTCYYYYMMDDHHmmsstemp(date: string): string {
    if (date) {
      try {
        const utcDate = Date.parse(date);
        const localDate = addMinutes(utcDate, new Date().getTimezoneOffset());
        return format(localDate, 'YYYY-MM-DDTHH:mm');
      } catch (e) {
        console.log(e);
      }
    }
    return '';
  }

  /**
   * Transform Local date to UTC date in the format (YYYYMMDDHHmmsstemp)
   * @param date: date to format
   */
  static getUTCYYYYMMDDHHmmss(date: string): string {
    if (date) {
      try {
        const utcDate = Date.parse(date);
        const localDate = addMinutes(utcDate, new Date().getTimezoneOffset());
        return format(localDate, 'YYYY-MM-DD HH:mm:ss');
      } catch (e) {
        console.log(e);
      }
    }
    return '';
  }

  /**
   * Transform Local date to UTC date in the format (YYYYMMDDHHmmsstemp)
   * @param date: date to format
   */
  static getLocalYYYYMMDDHHmmssA(date: string): string {
    if (date) {
      try {
        const utcDate = Date.parse(date);
        const localDate = addMinutes(utcDate, -(new Date().getTimezoneOffset()));
        return format(localDate, 'YYYY:MM:DD : HH:mm:ss A');
      } catch (e) {
        console.log(e);
      }
    }
    return '';
  }

  /**
   * Returns date in specified format (MMDDYYYYhhmmssA)
   * @param date: date to format
   */
  static getMMDDYYYYhhmmssA(date: string): string {
    if (date) {
      try {
        const localDate = Date.parse(date);
        return format(localDate, 'MMM DD, YYYY, hh:mm:ss A');
      } catch (e) {
        console.log(e);
      }
    }
    return '';
  }

  /**
   * Returns date in specified format (YYYY)
   * @param date: date to format
   */
  static getYYYY(date: string): string {
    if (date) {
      try {
        const localDate = Date.parse(date);
        return format(localDate, 'YYYY');
      } catch (e) {
        console.log(e);
      }
    }
    return '';
  }

  /**
   * Returns date in specified format (MMM)
   * @param date: date to format
   */
  static getMMM(date: string): string {
    if (date) {
      try {
        const localDate = Date.parse(date);
        return format(localDate, 'MMM');
      } catch (e) {
        console.log(e);
      }
    }
    return '';
  }

  /**
   * Returns date in specified format (DD)
   * @param date: date to format
   */
  static getDD(date: string): string {
    if (date) {
      try {
        const localDate = Date.parse(date);
        return format(localDate, 'DD');
      } catch (e) {
        console.log(e);
      }
    }
    return '';
  }

  /**
   * Returns date in specified format (DDMMM)
   * @param date: date to format
   */
  static getDDMMM(date: string): string {
    if (date) {
      try {
        const localDate = Date.parse(date);
        return format(localDate, 'DD-MMM');
      } catch (e) {
        console.log(e);
      }
    }
    return '';
  }

  /**
   * Returns date in specified format (hhmmssA)
   * @param date: date to format
   */
  static gethhmmssA(date: string): string {
    if (date) {
      try {
        const localDate = Date.parse(date);
        const utcDate = addMinutes(localDate, new Date().getTimezoneOffset());
        return format(utcDate, 'HH:mm:ss');
      } catch (e) {
        console.log(e);
      }
    }
    return '';
  }

  /**
   * Returns date in specified format (hhmmA)
   * @param date: date to format
   */
  static gethhmmA(date: string): string {
    if (date) {
      try {
        const localDate = Date.parse(date);
        return format(localDate, 'hh:mm:a');
      } catch (e) {
        console.log(e);
      }
    }
    return '';
  }

  /**
   * Returns curretn timezone
   */
  static getTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  /**
   * Converts utc timestamp to local timestamp
   * @param utcTimestamp
   */
  static getUTCtoLocalTimestamp(utcTimestamp: number): number {
    if (utcTimestamp) {
      try {
        const localDateTime = addMinutes(utcTimestamp, -(new Date().getTimezoneOffset()));
        return localDateTime.getTime();
      } catch (e) {
        console.log(e);
      }
    }
    return 0;
  }

  /**
   * Returns date in specified format (YYYYMMDD)
   * @param date: date to format
   */
  static getYYYYMMDD(date: string): string {
    if (date) {
      try {
        const localDate = Date.parse(date);
        return format(localDate, 'YYYY-MM-DD');
      } catch (e) {
        console.log(e);
      }
    }
    return '';
  }

  /**
   * Returns Date & time for any given format
   * @param date: date to parse
   * @param formatType: format to parse in
   */
  static getDateAndTime(date: string, formatType?): string {
    if (date) {
      try {
        const localDate = Date.parse(date);
        if (formatType) {
          return format(localDate, formatType);
        } else {
          return format(localDate, 'DD-MMM-YYYY hh:mm:a');
        }
      } catch (e) {
        console.log(e);
      }
    }
    return '';
  }

  /**
   * Returns today - 7 days
   */
  static getLastWeek() {
    // return subWeeks(this.getStartofToday(), 1);
    return subDays(startOfToday(), 7);
  }

  /**
   * Gets last month from today
   */
  static getLastMonth() {
    return subMonths(new Date(), 1);
  }

  /**
   * Gets last day from today
   */
  static getLastDay() {
    return subDays(startOfToday(), 1);
  }

  /**
   * Return the end of yesterday.
   */
  static getEndOfYesterday() {
    return endOfYesterday();
  }

  /**
   * Return the start of today.
   */
  static getStartofToday() {
    return startOfToday();
  }

  /**
   * Gets End of today
   */
  static getEndofToday() {
    return endOfToday();
  }

  /**
   * convert local date to utc in the given format
   * @param date: date to format
   * @param dateFormat: format to convert date in
   */
  static getUtcDateTimeStart(date: string, dateFormat = 'YYYY-MM-DD HH:mm:ss') {
    if (date) {
      try {
        const utcDate = Date.parse(date);
        const localDate = addMinutes(utcDate, (new Date().getTimezoneOffset()));
        return format(localDate, dateFormat);
      } catch (e) {
        console.log(e);
      }
    }
    return '';
  }


  /**
   * convert local date to utc in the given format (YYYY-MM-DD HH:mm:ss)
   * @param date: date to format
   */
  static getUtcDateTimeEnd(date: string) {
    if (date) {
      try {
        const utcDate = Date.parse(date);
        // const localDate = addMinutes(utcDate, 1440);
        const resultDate = addMinutes(utcDate, new Date().getTimezoneOffset());
        return format(resultDate, 'YYYY-MM-DD HH:mm:ss');
      } catch (e) {
        console.log(e);
      }
    }
    return '';
  }

  /**
   * Convert minutes in represenatble String
   * 90 will be converted to 1H 30M
   * @param time: value in minutes to convert
   */
  static getDuration(time?) {
    if (time >= 60) {
      const hours = Math.trunc(time / 60);
      const mins = Math.trunc(time % 60);
      return hours + 'H ' + ' ' + mins + 'M';
    } else if (time < 60) {
      return Math.round(time) + 'M';
    } else {
      return 0 + 'H ' + 0 + 'M';
    }
  }

  /**
   * get Hours from  minutes
   * 90 will return 2
   * @param time: value in minutes
   */
  static getHoursFromMinutes(time?) {
    if (time) {
      const hours = (time / 60).toFixed(1);
      return hours;
    }
  }

  /**
   * Sorts an array of dates
   * @param dates array of dates to sort
   */
  static sortDates(dates) {
    dates.sort(function (a, b) {
      let number: any;
      const dateA = +new Date(a);
      const dateB = +new Date(b);
      number = (dateA - dateB);
      return number;
    });


  }

  /**
   * Calculates difference of two dates in years
   * @param date1: first date
   * @param date2: second date
   */
  static DifferenceInYears(date1, date2) {
    const _MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365;
    if (!isNullOrUndefined(date1) && isNullOrUndefined(date2)) {
      const a = new Date(date1);
      const b = new Date(date2);
      const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
      const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
      const timeDiff = Math.floor((utc1 - utc2) / _MS_PER_YEAR);
      return timeDiff;
    }
  }

  /**
   * returns date in the format specified,
   * @param value: date to format
   * @param dateFormat: format bu default ('M/D/YYYY, h:mm:ss A')
   */
  static formatDate(value: any, dateFormat = 'M/D/YYYY, h:mm:ss A') {
    if (value) {
      const dateValue = new Date(value);
      // converts a date into NO Time Zone format
      const dateWithNoTimezone = new Date(
        dateValue.getUTCFullYear(),
        dateValue.getUTCMonth(),
        dateValue.getUTCDate(),
        dateValue.getUTCHours(),
        dateValue.getUTCMinutes(),
        dateValue.getUTCSeconds()
      );
      return format((dateWithNoTimezone), dateFormat);
    } else {
      return '-';
    }

  }


  static formatToUtc(date: string) {
    const time = date.split(' ')[1];
    const formatted_time = this.pad(time.split(':')[0]) + ':' + this.pad(time.split(':')[1]) + ':' + this.pad(time.split(':')[2]);
    const utc = format(date, 'YYYY-MM-DDT') + formatted_time + 'Z';
    return utc;
  }

  static pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
  }

  // static pad(number, digits) {
  //   return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
  // }


  // this function is used to calculate utc time and then use to formate it
  // its need parameter of date in milliseconds make sure you have passed desired parametet
  // this function is used corrently in density-reportig.component and in many more
  static formateUtcDateTimeString(dateInMilliseconds: any) {
    if (dateInMilliseconds) {
      var dt = new Date(dateInMilliseconds).toUTCString();
      var utcDate = dt;
      var splited = utcDate.split(" ");
      var time = splited[splited.length - 2];
      var datePart = splited.filter(x => (x !== time && x !== splited[splited.length - 1]));
      var stringDay = datePart.slice(1).join(' ');
      var wholeDay = splited[0] + " " + datePart.slice(1).join(' ');
      var desiredOUTput = this.formatDateUtcStringHelper(wholeDay) + " " + time;
      return desiredOUTput;
    }
    return;
  }
  // helper function used with formateUtcDateTimeString function date part in formate 2020-12-17
  static formatDateUtcStringHelper(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

}

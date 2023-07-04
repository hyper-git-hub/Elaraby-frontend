import {DateUtils} from './utils/date.utils';


/**
 * Contains the list of excel file columns that must be present in the file uploaded for QR generation
 */
export const QR_CODE_EXCEL_FILE_COLUMNS = ['Sr. No.', 'Vendor', 'Product', 'Model', 'MAC Address'];

// Hard-coded for now. This is used for QR generation
export const QR_CODE_DEVICE_PASSWORD = 'elaraby123';



/***
 * Array containing [start time for today, end datetime for today].
 * It is being used in app-reporting-component and can be further used whenever the user needs to use today’s date for reporting.
 */
export const TODAY_DATE_RANGE = [DateUtils.getStartofToday(), DateUtils.getEndofToday()];

/***
 * Array containing [start time for yesterday, end datetime for yesterday].
 * It is being used in app-reporting-component and can be further used whenever the user needs to use yesterday’s date for reporting.
 */
export const YESTERDAY_DATE_RANGE = [DateUtils.getLastDay(), DateUtils.getEndOfYesterday()];


/***
 * Array containing [start date for last week, end datetime for today].
 * It is being used in app-reporting-component and can be further used whenever the user needs to use weeks’s date for reporting.
 */
export const WEEK_DATE_RANGE = [DateUtils.getLastWeek(), DateUtils.getEndofToday()];



/***
 * Array containing [start date for current month, end datetime for today].
 * It is being used in app-reporting-component and can be further used whenever the user needs to use months’s date for reporting.
 */
const startMonth = DateUtils.now();
startMonth.setDate(1);
startMonth.setHours(0);
startMonth.setMinutes(0);
startMonth.setSeconds(0);
export const MONTH_DATE_RANGE = [startMonth, DateUtils.getEndOfMonth(startMonth)];

// DateUtils.getEndOfMonth(startMonth)

/***
 * Sample data format for ng2-charts
 */
export interface Ng2ChartDataInterface {
  data: any,
  label: string;

}

/**
 * hard coded excel sheet file extension
 */
export const excelFileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';


/**
 * Num of days duration lookup object
 */
export const DurationEnum = {
  7: 'week',
  0: 'day',
  30: 'month'
};


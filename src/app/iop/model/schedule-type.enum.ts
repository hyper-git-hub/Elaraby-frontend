import {Colors} from '../../core/utils/colors';


/**
 * Different types of eventTypeDropdown/schedules that can be created on a device
 */
export const IoPScheduleType = {
  2010: 'Scheduled Use', // Schedule on demand
  2011: 'Repeat Event', // Schedule daily
  2012: 'Quick Schedule',
  2016: 'Sleep',
  2017: 'Use Now',
  2022: 'Recurring Sleep Mode',

};


/**
 * Reverse lookup object for schedule type
 */

export enum IoPScheduleTypeReeverse {
  SCHEDULED_USE = 2010,
  REPEAT_EVENT = 2011,
  QUICK_SCHEDULE = 2012,
  SLEEP_MODE = 2016,
  USE_NOW = 2017,
  RECURRING_SLEEP_MODE = 2022,
}

/**
 * Lookup object that returns with different color for each device
 */

export const IoPScheduleTypeColors = {
  2010: 'darkorange', // Schedule on demand
  2011: 'forestgreen', // Schedule daily
  2012: Colors.INDIAN_RED, // Quick Schedule
  2016: 'steelblue', // Sleep
  2017: '#e9595b', // USe Now
  2022: 'crimson', // Recurring Sleep Mode
};

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {isNullOrUndefined} from 'util';
import {differenceInDays, endOfDay, isToday, isYesterday, startOfDay} from 'date-fns';
import {DateUtils} from '../../core/utils/date.utils';
import {MONTH_DATE_RANGE, TODAY_DATE_RANGE, WEEK_DATE_RANGE, YESTERDAY_DATE_RANGE} from '../../core/constants';

@Component({
  selector: 'app-reporting-buttons',
  templateUrl: './reporting-button.component.html',
  styleUrls: ['./reporting-button.component.css']
})
export class ReportingButtonComponent implements OnInit {

  dateRange: Date[];
  dateRangeStart: Date;
  dateRangeEnd: Date;
  maxDate = new Date();
  go = false;

  todayBtn = 'today';
  currentDate = new Date();


  isToday: boolean;


  @Input() type?: string; // type of report.
  @Input() search?; // show search bar
  @Input() selected?: string; // selected button
  @Input() calendarDimension = 'col-sm-3';
  @Input() btnsDimension = 'col-sm-5';
  @Input() hideBtn = ''; // hides a  button
  @Input() hideCalendar = false; // hides a  button
  @Input() showGenerateReport? = false; // Show Generate PDF option
  @Input() buttonGroupSize? = ''; // Show Generate PDF option
  @Input() buttonGroupColor? = ' btn-default'; // Show Generate PDF option
  @Input() timeRange? = false;
  @Input() calendarType? = 'range';
  @Input() showLabel? = false;


  date1: Date;


  @Output() btnClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() searchKeyword: EventEmitter<any> = new EventEmitter<any>();
  @Output() generate: EventEmitter<any> = new EventEmitter<any>();
  message = 'Please select End Date';

  rangeType: any = this.selected;

  constructor() {
  }

  ngOnInit() {
    if (this.selected) {
      if (this.selected === DaysRange.today) {
        this.todayClicked(this.type);
      }
      if (this.selected === DaysRange.yesterday) {
        this.yesterdayClicked(this.type);
      }
      if (this.selected === DaysRange.week) {
        this.weekClicked(this.type);
      }
      if (this.selected === DaysRange.month) {
        this.monthClicked(this.type);
      }
    }
  }

  todayClicked(type) {
    this.selected = 'today';
    if (this.calendarType === 'basic') {
      this.date1 = DateUtils.getStartofToday();
    }

    // this.checkDateDurationinWords(this.dateRangeEventsCreated);
    this.dateRange = TODAY_DATE_RANGE;
    if (this.timeRange) {
      this.dateRangeStart = this.dateRange[0];
      this.dateRangeEnd = this.dateRange[1];
    }
    this.goBtnClicked();
  }

  yesterdayClicked(type) {
    if (this.calendarType === 'basic') {
      this.date1 = DateUtils.getLastDay();
    }
    this.dateRange = YESTERDAY_DATE_RANGE;
    this.selected = 'yesterday';
    this.checkDateDurationinWords(this.dateRange);
    if (this.timeRange) {
      this.dateRangeStart = this.dateRange[0];
      this.dateRangeEnd = this.dateRange[1];
    }
    this.goBtnClicked();

  }

  weekClicked(type) {
    this.dateRange = WEEK_DATE_RANGE;
    this.selected = 'week';
    this.checkDateDurationinWords(this.dateRange);
    if (this.timeRange) {
      this.dateRangeStart = this.dateRange[0];
      this.dateRangeEnd = this.dateRange[1];
    }
    this.goBtnClicked();
  }

  monthClicked(type) {

    this.dateRange = MONTH_DATE_RANGE;
    this.selected = 'month';
    this.checkDateDurationinWords(this.dateRange);
    console.log(this.dateRange)
    if (this.timeRange) {
      this.dateRangeStart = this.dateRange[0];
      this.dateRangeEnd = this.dateRange[1];
    }
    this.goBtnClicked();
  }


  verifyDateRange(dateRange, type: string) {
    if (!isNullOrUndefined(dateRange) && !isNullOrUndefined(dateRange[1])) {
      if (type === 'basic') {
        this.dateRange = [];
        this.dateRange.push(startOfDay(new Date(dateRange[0])));
        this.dateRange.push(endOfDay(new Date(dateRange[1])));
      }
      this.checkDateDurationinWords(dateRange);
      this.go = true;
    } else {
      this.go = false;
    }
  }

  verifyEndDate() {
    if (!isNullOrUndefined(this.dateRangeEnd)) {
      this.checkDateDurationinWords([this.dateRangeStart, this.dateRangeEnd]);
      if (!isNullOrUndefined(this.dateRangeEnd)) {
        if (this.dateRangeStart >= this.dateRangeEnd) {
          this.go = false;
        } else {
          if (this.dateRangeStart.getDate() === this.dateRangeEnd.getDate()) {
            const timeDiff = (this.dateRangeEnd.getTime() - this.dateRangeStart.getTime()) / 60000;
            // console.log(timeDiff,"time");
            if (timeDiff > 10) {
              this.go = true;
            } else {
              this.go = false;
            }
          } else {
            this.go = true;
          }
        }
      } else {
        this.go = false;
      }
    } else {
      this.go = false;
    }
  }

  verifyStartDate() {
    if (!this.dateRangeStart) {
      this.dateRangeEnd = null;
    } else {

    }
  }

  focusStart() {
    this.dateRangeStart = null;
    this.go = false;
  }

  checkDateDurationinWords(dateRange) {
    // if ( differenceInDays( new Date(dateRangeEventsCreated[1]) , new Date(dateRangeEventsCreated[0]) )  === 0) {
    //   this.selected = 'today';
    // }
    // if (isToday(new Date(dateRange[1])) && isToday(new Date(dateRange[0]))) {
    //   this.selected = 'today';
    // } else if (isYesterday(new Date(dateRange[1])) && isYesterday(new Date(dateRange[0]))) {
    //   this.selected = 'yesterday';
    // } else if (differenceInDays(new Date(), new Date(dateRange[0])) === 7) {
    //   this.selected = 'week';
    // } else if (differenceInDays(new Date(), new Date(dateRange[0])) >= 28 && differenceInDays(new Date(), new Date(dateRange[0])) <= 31) {
    //   this.selected = 'month';
    // }
    // else if ( differenceInDays( new Date(dateRangeEventsCreated[1]) , new Date(dateRangeEventsCreated[0]) )  === 1) {
    //   this.selected = 'yesterday';
    // }
    // else {
    //   this.selected = null;
    // }

  }


  checkEndDate() {
    if (!isNullOrUndefined(this.dateRange) && !isNullOrUndefined(this.dateRange[0])) {
      this.message = 'Please select End Date';
      return !isNullOrUndefined(this.dateRange[1]);
    } else {
      return true;
    }
  }

  checkRangeEndDate() {
    if (!isNullOrUndefined(this.dateRangeStart)) {
      if (this.timeRange && !isNullOrUndefined(this.dateRangeEnd)) {
        if (this.dateRangeStart >= this.dateRangeEnd) {
          this.message = 'End Time should be greater than Start time!';
          return false;
        } else {
          if (this.dateRangeStart.getDate() == this.dateRangeEnd.getDate()) {
            const timeDiff = (this.dateRangeEnd.getTime() - this.dateRangeStart.getTime()) / 60000;
            // console.log(timeDiff,"time");
            if (timeDiff > 10) {
              return true;
            } else {
              this.message = 'Minimum difference Between End and Start date should be 10 mins!';
              return false;
            }
          }
          return true;
        }
      } else {
        this.message = 'Please select End Date';
        return !isNullOrUndefined(this.dateRangeEnd);
      }
    } else {
      return true;
    }
  }

  goBtnClicked() {
    if (!this.timeRange && this.selected != 'yesterday') {
      this.dateRange[1].setHours(23);
      this.dateRange[1].setMinutes(59);
      this.dateRange[1].setMinutes(59);
    }
    this.btnClicked.emit([this.dateRange, this.type, this.selected]);

  }

  goBtnAlteredClicked() {
    this.btnClicked.emit([[this.dateRangeStart, this.dateRangeEnd], this.type]);
  }

  generateReportClicked() {
    console.log('generating');
    this.generate.emit();
  }

  updateFilter(event) {
    this.searchKeyword.emit(event.target.value);
  }

}


enum DaysRange {
  today = 'today',
  yesterday = 'yesterday',
  week = 'week',
  month = 'month'
}

import { AfterContentInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DateUtils } from '../../core/utils/date.utils';

/*
 * Extending feature set to export data table content as excel file.
 * Used p-table built-in export feature.
 */
@Component({
  selector: 'app-export-csv',
  templateUrl: './export-csv.component.html',
  styleUrls: ['./export-csv.component.css'],
  providers: [DatePipe]

})
export class ExportCsvComponent implements OnInit, AfterContentInit, OnChanges {

  //  {field: key in data, header: label to display, time: OPTIONAL | true if time field, format:OPTIONAL| dateformat to apply},
  @Input() cols;

  // array of objects (data)
  @Input() rows;

  // name of file to be generated
  @Input() fileName = 'Report';

  // by default takes today's date
  @Input() dateGenerated?= new Date().toString();

  // size of btn 'Export As CSV'
  @Input() btnSize = 'btn-sm';
  csvRows: any;
  constructor(private datePipe: DatePipe) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    // console.log("change detect. : "+changes);
    // console.log("change detect rows. : "+this.rows);
    this.ngAfterContentInit();
  }


  /**
   * Format the date & generate file name like the format 'Entity Report_Jan20'
   */
  ngOnInit() {
    console.log("this.rows(from export csv component)= ", this.rows);

    // for (let i = 0; i < this.rows.length; i++) {
    //   // console.log("chs== ", this.rows[i]['signalRresponse'].IopsignalRresponse);
    //   // console.log(" this.contextrows[i].signalRresponse.chs== ", this.rows[i].signalRresponse)

    // }

    if ((this.dateGenerated)) {
      this.dateGenerated = DateUtils.getMMMMDY(this.dateGenerated);
      this.fileName = this.fileName + '_' + this.dateGenerated;
    }
  }

  /**
   * Filter out the time fields in rows & format them according to each's date format
   */

  ngAfterContentInit(): void {

    const timeFields = this.cols.filter(item => {
      return item.time === true;
    });
    this.rows.forEach(item => {
      for (let i = 0; i < timeFields.length; i++) {
        const date = timeFields[i].format ? timeFields[i].format : 'd-MMM-yy';
        item[timeFields[i].field] = this.datePipe.transform(item[timeFields[i].field], date);
      }
    });

    this.csvRows = [];
    this.csvRows = this.rows


  }

  // Added by naveed
  // this function is used to change status true/false of status property  to string online/offline
  //before exporting to csv 
  changeStatus() {
    this.csvRows = this.csvRows.map(item => {
      item.online_status == true ? item.online_status = "online" : item.online_status = "offline";
      return item;
    })
  }
  // After exporting file to csv we have to change back those properties because we have modified orgional arrays
  // that we need to change back to origional state ,
  changeStatusBack() {
    this.csvRows = this.csvRows.map(item => {
      item.online_status == "online" ? item.online_status = true : item.online_status = false
      return item;
    })

  }


}

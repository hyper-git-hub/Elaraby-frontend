import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DatatableService} from '../services/datatable.service';

@Component({
  selector: 'app-table-search',
  templateUrl: './table-search.component.html',
  styleUrls: ['./table-search.component.css']
})
export class TableSearchComponent implements OnInit {


  inputValue;

  // rows to search from
  @Input() rows = [];

  // keys to search with
  @Input() args = [];


  // boolean flag to disable textbox, to prevent user typing until rows are populated
  @Input() disableTextBox?;

  // tooltip array to dispay as placeholder on icon tags
  @Input() tooltipArray = [];

  // filtered rows
  @Output() filter: EventEmitter<any> = new EventEmitter();

  constructor(private datatableService: DatatableService) {
  }

  ngOnInit() {
  }


  /**
   * Use datatable service search mechanism to filter given rows & return the filtered rows.
   */
  updateFilter() {
    const filteredRows = this.datatableService.updateFilter(this.inputValue, this.rows, this.args);
    this.filter.emit(filteredRows);
  }

}

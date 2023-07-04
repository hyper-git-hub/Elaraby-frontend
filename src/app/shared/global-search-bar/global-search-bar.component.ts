import {Component, OnInit} from '@angular/core';
import {isNullOrUndefined} from 'util';
import {Router} from '@angular/router';
import {HeaderService} from '../services/header.service';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-global-search-bar',
  templateUrl: './global-search-bar.component.html',
  styleUrls: ['./global-search-bar.component.css']
})

/**
 * Search Bar on header
 */
export class GlobalSearchBarComponent implements OnInit {

  searchItem;
  items: any[];

  constructor(private router: Router,
              private headerService: HeaderService,
  ) {

  }

  ngOnInit() {
  }

  /**
   * Gets called when an option is selected from the suggestions
   * @param opt: can be of the format {id: id of the entity, title: Name of enetity, entity_type: "Iop Device"}
   */
  onOptionSelected(opt: any) {
    const entity_type = opt.entity_type;
    if (entity_type === 'Iop Device') {
      this.gotoPageWithRouteParams('waterheaters', opt['id']);
    }

  }

  /**
   * Helps the user to navigate to the page for the option selected
   * @param pageName
   * @param value
   */
  gotoPageWithRouteParams(pageName: string, value?) {
    this.searchItem = null;

    // for routes with id
    if (!isNullOrUndefined(value)) {
      this.router.navigate(['/iop/' + pageName, value]);
      return true;
    } else {

      // for dashbaord pages
      this.router.navigate(['/iop/' + pageName]);
      return true;
    }
  }

  /**
   * Gets called when the user has finished typing.
   * Makes a call to backedn with the keyword & returns the result
   * @param event: keyword typed in the search bar.
   * Populates the sueestion array with the results returned
   */
  completedTyping(event) {
    const query = event.query;
    this.headerService.getSearch('search_iol', {search: query})
      .subscribe((result) => {
        this.items = result.response;
      });
  }


}

import { Injectable } from '@angular/core';
import {isNullOrUndefined} from 'util';

/**
 * Service containign methids that helps in routing / navigation
 */
@Injectable()
export class GotoPageService {

  constructor() { }


  /**
   * redirects user to heaters single page
   * @param id-> id of device navigate
   */
  public gotoHeater(id){
    if(isNullOrUndefined(id))
      return null;
    else
      return '/iop/waterheaters/' + id;
  }

}

import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../core/services/auth.service';


/**
 * Can be used if a person who isn’t meant to use the web-app log into the system. For e.g. a simple user
 */

@Component({
  selector: 'app-unauthorized-page',
  templateUrl: './unauthorized-page.component.html',
  styleUrls: ['./unauthorized-page.component.css']
})
export class UnauthorizedPageComponent implements OnInit {

  constructor(private route: Router, private  authService: AuthService) {
  }

  ngOnInit() {
  }

  /**
   * Gets called when the user clicks on logout button
   * */
  logout() {
    this.authService.unsetUser();
    this.route.navigateByUrl('/');
  }

}

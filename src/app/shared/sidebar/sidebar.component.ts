import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { el } from '@angular/platform-browser/testing/src/browser_util';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

/**
 * Sidebar Component containing menu & shortcuts to routes
 */
export class SidebarComponent implements OnInit {

  productionLine: boolean;

  constructor(private authService: AuthService) {
    console.log("User Email= ", this.authService.getUser()['email']);
    if (this.authService.getUser()['email'] === 'productionline@elaraby.com') {
      this.productionLine = true;
    } else {
      this.productionLine = false;
    }

  }

  ngOnInit() {
  }


}

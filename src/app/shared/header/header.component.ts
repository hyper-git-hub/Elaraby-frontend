import {Component, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {isNullOrUndefined} from 'util';
import {Router} from '@angular/router';
import {AuthService} from '../../core/services/auth.service';
import {User} from '../../core/model/user';
import {Message} from 'primeng/api';
import {AngularFireDatabase} from 'angularfire2/database';
import {HttpController} from '../../core/interceptors/loading-controller';
import {ApiResponse} from '../../core/model/api.response';
import {HeaderService} from '../services/header.service';
import {DataTransferService} from '../services/data-transfer.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() bgColor = 'bg-iol-800';
  @Input() logo = 'assets/images/logo.png';
  @Input() dropdownOptions;
  @ViewChild('try') private try;
  @ViewChild('closeForm') private closeForm;


  userName = null;
  userEmail;
  user;
  authorizeUser;
  alert_count: any;

  msgs: Message[] = [];
  notifications_list = [];

  constructor(private route: Router,
              private authService: AuthService,
              private headerService: HeaderService,
              private dataTransferService: DataTransferService,
              private router: Router,
              public fdb: AngularFireDatabase,
              private renderer: Renderer2) {
    this.authorizeUser = this.authService.isAdminUser();
    this.dataTransferService.dataUpdated.subscribe(
      data => {
        this.user = data;
        this.userName = data.first_name + ' ' + data.last_name;
      });

  }

  /**
   * Gets the currently logged in user.
   * Format user email to connect with firebase.
   */
  ngOnInit() {
    this.user = this.authService.getUser() as User;
    this.userName = this.user.first_name + ' ' + this.user.last_name;
    // const newEmail = this.user.email.replace('.', '-').replace('.', '-');
    // this.fdb.object(newEmail).valueChanges().subscribe(item => this.updateAlertCount(item));

  }

  redirectToHome() {
    this.route.navigate(['/iol/' + module]);
  }

  /**
   * log out the user & clears data from localStorage
   */
  logout() {
    this.authService.unsetUser();
    this.route.navigateByUrl('');
  }


  /**
   * invoke when user clicks the bell icon
   * resets the counter for new notifications & calls API call for notification list.
   */
  btnClick() {
    this.alert_count = 0;
    this.getAlertList();
  }

  /**
   * Updates notification counter
   * @param item: the counter value
   */
  updateAlertCount(item) {
    this.renderer.setStyle(
      this.try, 'z-index', '-1');
    this.alert_count = item;
    this.show(item);
    if (item === 0) {
      return;
    }
    // this.getAlertList();
  }


  /**
   * Shows a floating message on screen if user received any new message
   * @param item
   */
  show(item) {
    if (item === 0) {
      return;
    }
    this.renderer.setStyle(this.try, 'z-index', '1003');
    this.msgs.push({severity: 'success', summary: 'You have new notification', detail: ''});
    setTimeout(() => this.clear(), 4000);
  }


  /**
   * removes the messages
   */
  clear() {
    this.msgs = [];
    this.renderer.setStyle(
      this.try, 'z-index', '-1');
  }

  /**
   * Method hits the API Again on refersh button action
   */
  refreshNotifications() {
    this.getAlertList();
  }


  /**
   * Retrieves notification list
   */
  getAlertList() {
    this.headerService.getIolNotifications('get_iol_notifications', {})
      .subscribe(new class extends HttpController <ApiResponse<any>> {
          onComplete(): void {
          }

          onError(errorMessage: string, err: any) {
            // do
            console.log(errorMessage);
          }

          onNext(apiResponse: ApiResponse<any>): void {
            console.log('apiResponse', apiResponse);
            if (apiResponse.status) {
              this.context.notifications_list = apiResponse.response;
            }

          }

        }(this)
      );
  }

  /**
   * Redirect to respective page
   * @param notification: object clicked from list
   */

  goto_alert(notification) {
    const type = notification['notification_type'];
    const value = notification['activity_id'];
    const status = notification['status_id'];
    if (status === 1) {
      this.closeForm.nativeElement.click();
      this.router.navigate(['/iop/']);
    }
  }


  /**
   * gets class for notification.
   * Different class can be applied base on notification type
   * @param value: notification type
   */
  getIconClass(value) {

    return 'glyphicon glyphicon-bell';
  }

  /**
   * Gets color & size for notification icon
   * @param value: notification type
   */
  getIconStyle(value) {
    return {'color': '#3193c7', 'font-size': '40px'};

  }

  /**
   * Get type of notifications
   * @param value: notification type
   */
  get_type(value) {

    return 'Default';
  }

  /**
   *
   * @param event
   */
  isViewed(event) {
    const user = this.authService.getUser().email;
    if (!isNullOrUndefined(event)) {
      for (let i = 0; i < event.length; i++) {
        if (event[i].email === user && event[i].viewed) {
          return false;
        }
      }
    }
    return true;
  }


}

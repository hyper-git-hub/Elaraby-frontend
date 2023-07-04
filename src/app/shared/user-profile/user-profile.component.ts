import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpController} from '../../core/interceptors/loading-controller';
import {ApiResponseWithHttpStatus} from '../../core/model/api.response';
import {HttpStatusCodeEnum} from '../../core/enum/HttpStatusCodeEnum';
import {AppLoader} from '../../core/utils/app-loader';
import {UserService} from '../../core/services/user.service';
import {isNullOrUndefined} from 'util';
import {ErrorMessage} from '../../core/enum/error-message';
import {DateUtils} from '../../core/utils/date.utils';
import {FormService} from '../services/form.service';
import {PrimengDropdownItem} from '../../core/model/primng-dropdown-item';
import {UserRoleEnum} from '../../core/enum/user-role.enum';
import {AuthService} from '../../core/services/auth.service';
import {SwalService} from '../../core/services/swal.service';
import {Router} from '@angular/router';
import {CustomValidators} from '../../core/utils/custom.validator';
import {DataTransferService} from '../services/data-transfer.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})


/**
 * A single page displaying details about the logged in user so the user may change his basic info.
 * */
export class UserProfileComponent implements OnInit {

  // reset password form
  form: FormGroup;

  // forgot password form
  forgotPasswordForm: FormGroup;


  // profile form
  profileForm: FormGroup;


  showPassword = false;
  showConfirmPassword = false;
  showCurrentPassword = false;
  errorMessages = [];

  appLoader = new AppLoader();


  password = null;
  oldPassword = null;
  user: any;
  restrictedForm = false;

  notImage = false;
  showAlert = true;
  isAdmin;
  errorMessages1 = [];


  avatar: File = null;
  avatar_url: string = null;
  date_of_joining: Date;
  itemListGenders = [];
  itemListLanguage = [];
  itemListModule = [];

  selectedLanguage;
  selectedGender;


  @ViewChild('closeForm') private closeForm;
  @ViewChild('closeForgotPasswordForm') private closeForgotPasswordForm;
  @ViewChild('myInput')
  myInputVariable: any;
  @ViewChild('img')
  image: any;


  constructor(private authService: AuthService,
              private swalService: SwalService,
              private formService: FormService,
              private dataTransferService: DataTransferService,
              private userService: UserService,
              private formBuilder: FormBuilder,
              private route: Router) {

    // reset password form
    this.form = this.formBuilder.group({
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
        oldPassword: ['', Validators.required]
      },
      {
        validator: [CustomValidators.samePasswords, CustomValidators.passwordMatcher] // your validation method,

      });

    // forgot password form
    this.forgotPasswordForm = this.formBuilder.group(
      {
        currentEmail: ['', [Validators.required, Validators.email]]
      }
    );

    // profile form
    this.profileForm = this.formBuilder.group({
      id: [{value: null, disabled: true}],
      first_name: [null, [CustomValidators.isAlphabetsAndNumbers, Validators.required]],
      last_name: [null, [CustomValidators.isAlphabetsAndNumbers, Validators.required]],
      email: [],
      // photo_method: [],
      role: [],
      gender: [],
      contact_number: [null],
      date_joined: [],
      language: [],
      preferred_module: [],
      customer: [],
    });
  }

  ngOnInit() {
    this.getDropDowns();
    this.getUser();
  }

  /**
   * Populates dropdowns for genderm languaged
   */
  getDropDowns() {

    // GENDER dropdown
    this.formService.getOptionsDropdown({option_key: 'gender'})
      .subscribe(new class extends HttpController <ApiResponseWithHttpStatus<any[]>> {
          onComplete(): void {
          }

          onError(errorMessage: string, err: any) {
            // do
            console.log(errorMessage);
          }

          onNext(apiResponse: ApiResponseWithHttpStatus<any[]>): void {
            console.log('gender', apiResponse);
            if (apiResponse.status === HttpStatusCodeEnum.Success) {
              this.context.itemListGenders = apiResponse.response['option_values'];
            }
          }
        }(this)
      );

    // Languages Dropdown
    this.formService.getOptionsDropdown({option_key: 'hypernet_languages'})
      .subscribe(new class extends HttpController <ApiResponseWithHttpStatus<any[]>> {
          onComplete(): void {
          }

          onError(errorMessage: string, err: any) {
            // do
            console.log(errorMessage);
          }

          onNext(apiResponse: ApiResponseWithHttpStatus<any[]>): void {
            console.log('languages', apiResponse);

            if (apiResponse.status === HttpStatusCodeEnum.Success) {
              this.context.itemListLanguage = apiResponse.response['option_values'];
            }
          }
        }(this)
      );

    // this.itemListModule = [
    //   {label: 'IoL (Bins)', value: iolModules.bins},
    //   {label: 'IoL (trucks)', value: iolModules.trucks},
    //   {label: 'IoA', value: hypernymModules.ioa},
    //   {label: 'IoL', value: hypernymModules.iol},
    //   {label: 'FFP', value: hypernymModules.ffp}
    // ];

  }


  /**
   * Fetches user's details
   */
  getUser() {
    const user = this.authService.getUser();

    // gets user's role
    this.isAdmin = (user.user_role_id === UserRoleEnum.Admin);

    this.userService.getUserData()
      .subscribe(new class extends HttpController <ApiResponseWithHttpStatus<any[]>> {
          onComplete(): void {
          }

          onError(errorMessage: string, err: any) {
            // do
            console.log(errorMessage);

          }

          onNext(apiResponse: ApiResponseWithHttpStatus<any[]>): void {
            if (apiResponse.status === HttpStatusCodeEnum.Success) {
              console.log('user', apiResponse.response);
              this.context.user = apiResponse.response[0];


              this.context.setForm();
            } else if (apiResponse.status === HttpStatusCodeEnum.Error) {
              this.context.swalService.getErrorSwal(apiResponse.message);
            }
          }
        }(this, this.appLoader)
      )
    ;


  }

  /**
   * Populates the profile form according to the value fetched drom API call
   */
  setForm() {
    this.avatar_url = isNullOrUndefined(this.user.photo_method) ? null : this.user.photo_method;

    // this.avatar =  null;
    this.date_of_joining = (new Date(this.user.date_joined_date));

    this.selectedLanguage = {label: this.user.language, value: this.user.language_label};
    this.selectedGender = {label: this.user.gender, value: this.user.gender_label};

    this.profileForm.setValue({
      id: this.user.id,
      // photo_method: this.user.photo_method,
      first_name: this.user.first_name,
      last_name: this.user.last_name,
      email: this.user.email,
      role: this.user.role_name,
      gender: this.isAdmin ? this.user.gender : this.user.gender_label,
      contact_number: this.user.contact_number,
      date_joined: (this.date_of_joining),
      language: this.isAdmin ? this.user.language : this.user.language_label,
      preferred_module: this.user.preferred_module,
      customer: this.user.customer_name,
    });

  }

  /**
   * Validated the form for Reset Password
   */
  validatePasswordForm(): boolean {
    let isValid = true;
    this.errorMessages = [];
    if (this.form.hasError('mismatch')) {
      this.errorMessages.push('Mismatch Password');
      isValid = false;
    }
    if (this.form.hasError('same')) {
      this.errorMessages.push('Password cannot be same');
      isValid = false;
    }

    return isValid;
  }


  /**
   * Get calls when user submits  reset password  form
   * Makes a call with previous password & new password
   */
  onSubmitPassword() {
    if (this.validatePasswordForm()) {
      this.password = this.form.value.password;
      this.oldPassword = this.form.value.oldPassword;
      const params = {};
      params['password'] = this.password;
      params['old_password'] = this.oldPassword;
      this.userService.modifyUserData(params)
        .subscribe(new class extends HttpController <ApiResponseWithHttpStatus<any[]>> {
            onComplete(): void {

            }

            onError(errorMessage: string, err: any) {
              // do
              console.log(errorMessage);

            }

            onNext(apiResponse: ApiResponseWithHttpStatus<any[]>): void {
              console.log(apiResponse);
              if (apiResponse.status === HttpStatusCodeEnum.Success) {
                this.context.closeForm.nativeElement.click();
                this.context.swalService.getSuccessSwal('Password has been reset');
              } else if (apiResponse.status === HttpStatusCodeEnum.Error) {
                this.context.swalService.getErrorSwal(apiResponse.message);
              }
            }
          }(this, this.appLoader)
        );
    }
  }


  /**
   * Gets called when user submits on forgot password form
   */
  onSubmitForgotPassword() {
    this.closeForgotPasswordForm.nativeElement.click();
    this.forgotPassword();
  }

  /**
   * Makes a call with user's email address
   */
  forgotPassword() {
    const params = {};
    params['email'] = this.forgotPasswordForm.value.currentEmail;
    this.userService.forgotPasword(params)
      .subscribe(new class extends HttpController <ApiResponseWithHttpStatus<any[]>> {
          onComplete(): void {

          }

          onError(errorMessage: string, err: any) {
            // do
            console.log(errorMessage);

          }

          onNext(apiResponse: ApiResponseWithHttpStatus<any[]>): void {
            console.log(apiResponse);
            if (apiResponse.status === HttpStatusCodeEnum.Success) {
              this.context.swalService.getInfoSwal('Please check you email for further assistance');
            } else if (apiResponse.status === HttpStatusCodeEnum.Error) {
              this.context.swalService.getErrorSwal(apiResponse.message);
            }
          }

        }(this, this.appLoader)
      );

  }

  resetPasswordForm() {
    this.form.reset();
  }

  /**
   * validtes profile form & return true|false accordingly
   */
  validate(): boolean {
    let isValid = true;
    this.errorMessages1 = [];
    if (this.profileForm.get('first_name').hasError('required')) {
      this.errorMessages1.push('First Name ' + ErrorMessage.REQUIRED);
      isValid = false;
    }
    if (this.profileForm.get('first_name').hasError('isAlphabetsAndNumbers')) {
      this.errorMessages1.push('First Name ' + ErrorMessage.IS_ALPHABETS_AND_NUMBERS);
      isValid = false;
    }
    return isValid;
  }

  /**
   * Gets called when user submits profile form after modifications
   * @param formValue: form data to send
   */
  onSubmit(formValue) {
    if (this.validate()) {
      formValue['role'] = this.user.role;
      formValue['date_joined'] = DateUtils.getYYYYMMDD(this.date_of_joining.toString());
      formValue['preferred_module'] = formValue['preferred_module'] || 1;

      // we will be suing form data because of the pictur attribute
      const param: FormData = new FormData();
      if (!isNullOrUndefined(this.avatar)) {
        param.append('photo_method', this.avatar);
      } else if (!isNullOrUndefined(this.avatar_url)) {
        let image = this.user['photo_method'].split('/');
        image = image[image.length - 1];
        param.append('photo_method', image);
      }
      param.append('contact_number', formValue['contact_number']);
      param.append('date_joined', formValue['date_joined']);
      param.append('email', formValue['email']);
      param.append('first_name', formValue['first_name']);
      param.append('gender', formValue['gender']);
      param.append('language', formValue['language']);
      param.append('last_name', formValue['last_name']);
      param.append('preferred_module', formValue['preferred_module']);
      param.append('role', formValue['role']);
      this.userService.modifyUserData(param)
        .subscribe(new class extends HttpController <ApiResponseWithHttpStatus<any[]>> {
            onComplete(): void {
            }

            onError(errorMessage: string, err: any) {
              // do
              console.log(errorMessage);


            }

            onNext(apiResponse: ApiResponseWithHttpStatus<any[]>): void {
              if (apiResponse.status === 200) {
                this.context.profileForm.markAsPristine();
                this.context.swalService.getSuccessSwal('User has been edited successfully');

               // gets updated use
                const u = this.context.authService.getUser();
                u.avatar = apiResponse.response['photo_method'];
                u.first_name = apiResponse.response['first_name'];
                u.last_name = apiResponse.response['last_name'];
                u.preferred_module = apiResponse.response['preferred_module'];

                // service that updates the above mentioned changes in header
                this.context.dataTransferService.setData(u);

                // updates user's details in localstorage
                localStorage.setItem('user', JSON.stringify(u));

                this.context.getUser();
                this.context.deactivate = true;
                this.context.submitted = true;
              } else if (apiResponse.status === 500) {
                this.context.swalService.getErrorSwal('Profile not Updated', apiResponse.message);
              }
            }
          }(this, this.appLoader)
        );
    }
  }

  /**
   * Gets called when user removes his profile image
   */
  removeImage() {
    if (this.myInputVariable) {
      this.myInputVariable.nativeElement.value = '';
    }
    this.avatar_url = null;
    this.profileForm.markAsDirty();
    this.avatar = null;
    this.notImage = false;
    this.image.nativeElement.src = '/assets/images/iol/driver_placeholder.png';
  }


  /**
   * gets called when user uploads a new picture
   * @param event: event function, containing uploaded file @event.target.files
   * Validates file size
   */
  fileChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      // img.file = file;
      const file: File = fileList[0];
      const img = document.querySelector('#preview img') as HTMLImageElement;
      if (fileList[0].type.indexOf('image') === -1) {
        this.myInputVariable.nativeElement.value = '';
        this.notImage = true;
        this.profileForm.get('avatar').markAsPristine();
        this.showAlert = true;
      } else if (file.size > 1000000) { // 1MB
        this.myInputVariable.nativeElement.value = '';
        alert('File is too big! Image must be less than 1 MB');
        // this.avatar = null;
      } else {
        this.profileForm.markAsDirty();
        this.notImage = false;
        this.avatar = file;
        this.avatar_url = ' ';
        const reader = new FileReader();
        reader.onload = (function (aImg) {
          return function (e) {
            aImg.src = e.target.result;
          };
        })(img);
        reader.readAsDataURL(file);
      }
    }
  }


}

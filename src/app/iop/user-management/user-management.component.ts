import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DatatableService } from '../../shared/services/datatable.service';
import { SwalService } from '../../core/services/swal.service';
import { FormService } from '../../shared/services/form.service';
import { ConfirmationService, Message } from 'primeng/api';
import {CustomValidators} from '../../core/utils/custom.validator';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  userForm: FormGroup;

  date_of_joining = '';
  itemListGenders = [];
  restrictedForm:any;
  itemListLanguage = []

  constructor(public formBuilder: FormBuilder,
    private datatableService: DatatableService,
    private formService: FormService,
    private confirmationService: ConfirmationService,
    private swalService: SwalService) { 

      this.userForm = this.formBuilder.group({

        first_name: [null, [CustomValidators.isAlphabetsAndNumbers, Validators.required]],
        last_name: [null, [CustomValidators.isAlphabetsAndNumbers, Validators.required]],
        email: [],

      });


    }

  ngOnInit() {
  }

  getUsersList() {

  }

  clearForm() {

  }

  onSubmit(formValue) {

  }

}

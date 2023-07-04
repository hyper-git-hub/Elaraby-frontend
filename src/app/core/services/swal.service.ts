import { Injectable } from '@angular/core';
import swal from 'sweetalert2';
import { EntityStatusEnum } from '../enum/entity-type.enum';

/***
 * A generaic wrapper for sweet alert
 */
@Injectable()
export class SwalService {

  constructor() {
  }

  /**
   * Returns success swal with autoclose timer
   * @param message: Heading
   * @param timer: ms for autoclose
   * @param text: subheading
   */
  // swal for success
  getSuccessSwal(message, timer = 1500, text?) {
    return swal({
      type: 'success',
      title: message,
      text: text,
      showConfirmButton: false,
      customClass: 'swal-wide',
      timer: timer
    });
  }

  /**
   * Returns swal for warning type
   * @param message text to display
   */
  // Swal for error
  getErrorSwal(message = 'Something went wrong!') {
    swal({
      type: 'error',
      title: 'Error!',
      text: message,
      // footer: footerMsg? footerMsg : '',
    });
  }

  /**
   * Returns swal for info type
   * @param message text to display
   *    * @param timer: ms for autoclose

   */
  // swal for info
  getInfoSwal(message, timeout = 1500) {
    return swal({
      type: 'info',
      title: message,
      showConfirmButton: false,
      customClass: 'issue',
      timer: timeout
    });
  }

  /**
   * Asks user confirmation user.
   * @param swalType
   * @param message
   */
  async confirmMessage(swalType, message) {
    return new Promise((resolve, reject) => {

      swal({
        type: swalType,
        text: message,
        customClass: 'issue',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        confirmButtonClass: 'btn btn-danger margin-5',
        cancelButtonClass: 'btn btn-warning margin-5',
        buttonsStyling: false,

      })
        .then((result) => {
          if (result.value) {
            resolve(true);
          } else {
            resolve(false);

          }
        });
    });

  }

  /**
   * Gets warning message
   * @param message
   */
  // swal for warning
  getWarningSwal(message?) {
    swal({
      type: 'warning',
      text: message,
      customClass: 'issue',

    });
  }


  val;

  /**
   * Delete/Inactive feature confirmation for user
   * @param objToDelete : row to delete
   * @param title
   */
  async getDeleteSwal(objToDelete?, title = 'What do you want to do with ' + objToDelete.name + ' ?') {
    return new Promise((resolve, reject) => {

      swal({
        text: title,
        title: 'You won\'t be able to revert this!',
        type: 'warning',
        customClass: 'issue',
        showCancelButton: (objToDelete.status_id === EntityStatusEnum.Active) || ((objToDelete.status === EntityStatusEnum.Active)),
        confirmButtonText: 'Delete Record',
        cancelButtonText: 'Mark as Inactive',
        confirmButtonClass: 'btn btn-sm btn-danger margin-5',
        cancelButtonClass: 'btn btn-sm btn-warning margin-5',
        buttonsStyling: false,
        showCloseButton: true,
        allowOutsideClick: false,
      })
        .then((result) => {
          console.log('result', result);
          if (result.value) {
            resolve(EntityStatusEnum.Delete);
          } else if (result.dismiss === swal.DismissReason.cancel) {

            resolve(EntityStatusEnum.Inactive);
          } else {
            resolve(null);

          }
        });


    });

  }

  async askForDeletion(message) {

    return new Promise((resolve, reject) => {

      this.showSwal(message)
        .then((result) => {
          if (result.value) {
            resolve(true);
          } else {
            resolve(false);
          }
        });


    });
  }

  /** Asks for deleting record only.
   *
   * @param message
   */

  showSwal(message) {
    return swal({
      title: 'Confirmation',
      text: message,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete!',
      cancelButtonText: 'No',
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: 'issue',
      confirmButtonClass: 'btn btn-sm btn-danger margin-5',
      cancelButtonClass: 'btn btn-sm btn-warning margin-5',
    });
  }


  showLoadingSwal() {
    swal({
      title: 'Generating QR...',
      text: 'Please wait',
      imageUrl: 'assets/images/iop/loader.gif',
      showConfirmButton: false,
      allowOutsideClick: false
    });
  }


  async getMultipleDeleteSwal(arr, showInactive = true, title = '', type = 'info') {
    return new Promise((resolve, reject) => {

      swal({
        text: title,
        title: 'You won\'t be able to revert this!',
        type: 'warning',
        customClass: 'issue',
        showCancelButton: showInactive,
        showCloseButton: true,
        allowOutsideClick: true,
        confirmButtonText: 'Delete Records',
        cancelButtonText: 'Mark as Inactive',
        confirmButtonClass: 'btn btn-sm btn-danger margin-5',
        cancelButtonClass: 'btn btn-sm btn-warning margin-5',
        buttonsStyling: false,
      })
        .then((result) => {
          if (result.value) {
            resolve(EntityStatusEnum.Delete);
          } else if (result.dismiss === swal.DismissReason.cancel) {

            resolve(EntityStatusEnum.Inactive);
          } else {
            resolve(null);

          }
        });
    });
  }

  async getMultipleDeleteSwalWithActive(arr, showaActive = true, title = '', type = 'info') {
    return new Promise((resolve, reject) => {

      swal({
        text: title,
        title: 'You won\'t be able to revert this!',
        type: 'warning',
        customClass: 'issue',
        showCancelButton: showaActive,
        showCloseButton: true,
        allowOutsideClick: true,
        confirmButtonText: 'Delete Records',
        cancelButtonText: 'Mark as Active',
        confirmButtonClass: 'btn btn-sm btn-danger margin-5',
        cancelButtonClass: 'btn btn-sm btn-primary margin-5',
        buttonsStyling: false,
      })
        .then((result) => {
          if (result.value) {
            resolve(EntityStatusEnum.Delete);
          } else if (result.dismiss === swal.DismissReason.cancel) {

            resolve(EntityStatusEnum.Active);
          } else {
            resolve(null);

          }
        });
    });
  }

}

/****
 * This file contains various formats for http responses that are being used in this project.
 */


/***
 * For Calls with boolean status
 */
export class ApiResponse<T> {
  message: string;
  response: T;
  status: boolean;
}

/***
 * For Calls with http number code in status key
 */

export class ApiResponseWithHttpStatus<T> {
  message: string;
  response: T;
  status: number;
}


/***
 * For chunking in GET call
 */
export class ApiResponseWithRemainingFlag<T> {
  message: string;
  response: T;
  status: number;
  remaining: boolean;
  count: number;
}

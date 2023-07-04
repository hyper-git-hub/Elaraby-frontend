import {Customer} from './customer';
import {Module} from './module';


/**
 * Sample model class for user
 */
export class User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  token: string;
  customer: Customer;
  preferred_module: number;
  module: Module;
  user_role_id: number;
  user_entity_type: number;
  is_staff: boolean;
  associated_entity: number;
  user_role_name: string;
}

/**
 * sample data format for primeng dropdown
 */
export class PrimengDropdownItem {
  label: string;
  value: string;


  constructor(id, itemName: string) {
    this.label = itemName;
    this.value = id;
  }



}

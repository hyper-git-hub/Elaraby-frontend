import { isNullOrUndefined } from 'util';

/**
 * Calculates percentage difference between two values.
 * If result > 0 there is rise otherwise fall.
 */
export class PercentageDifference {

  static calculateDifference(old_number: number, new_number: number): any {
    if (isNullOrUndefined(old_number)) { old_number = 0; }
    if (isNullOrUndefined(new_number)) { new_number = 0; }
    const increase = new_number - old_number;
    let percentage_increase = 0;
    if (increase === 0) { percentage_increase = 0; }
    else if (old_number <= 0) { percentage_increase = 100; }
    else { percentage_increase = ((increase) / old_number) * 100; }
    return (percentage_increase);
    // var decreaseValue = old_number - new_number;
    // return (decreaseValue / old_number) * 100;

  }
}

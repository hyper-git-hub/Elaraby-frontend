// :[{"dID":"homeAppliances-testDevice1","ts":"11/05/2018 11:30:53","cht":"25","chs":false,"ctt":"60"}]
import { isValid } from 'date-fns';


/**
 * Sample response model for SIgnalR packet
 */
export class IopsignalRresponse {
  id: any;  // Device ID
  ts: any; // Timestamp
  d: any;

  cht: any; // Current Heater Temperature
  chs: any; // Current Heater Status
  ctt: any; // Current Temperature Threshold
  err: any; // Error count

  cdt: any; // Display Temperature
  clm: any; // Device Lock Mode

  constructor(dID: any, ts: any, cht: any, chs: any, ctt: any, err: any, d: any, cdt: any, clm: any) {
    this.id = dID;
    this.cht = cht;
    this.chs = chs;
    this.ctt = ctt;
    this.err = err;
    if (ts != null) {
      const newDate = new Date(ts);
      if (isValid(newDate)) {
        this.ts = ts;
        this.ts = newDate;
      }
    }

    this.d = d;
    this.cdt = cdt;
    this.clm = clm;

  }
}






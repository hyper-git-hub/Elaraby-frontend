/**
 * Map object for the error codes received by signalR & the APi call
 */
//

export const Power = {
  0: 1,
  1: 2,
  2: 4,
  3: 8,
  4: 16,
  5: 32,
  6: 64,
  7: 128,
  8: 256,
  9: 512,
  10: 1024
};


export const DeviceErrorEnum = {
  0: 'No Error ',
  1: 'Flange sensor is not connected',
  2: 'Flange sensor is short circuited',
  4: 'Display sensor is not connected',
  8: 'Display sensor is short circuited',
  16: 'Flange sensor read over heating-temperature (>= 85°)',
  32: 'Display sensor read over heating-temperature (>= 85°)',
  64: 'Standby switch stuck in pressed state for 1Minute',
  128: 'Plus switch stuck in pressed state for 1Minute',
  256: 'Minus switch stuck in pressed state for 1Minute',
  512: 'Flange sensor detect temperature is frozen- temperature (<= 2°)',
  1024: 'Display sensor detect temperature is frozen-temperature (<= 2°)',
  404: 'Water heater Module Disconnected'
  // 16: 'flange sensor\'s temp is overheating',
  // 32: 'display sensor\'s temp is overheating',
  // 64: 'heating cycle is not working',
  // 128: 'standby switch is stuck',
  // 256: 'plus switch is stuck',
  // 404: 'Broken wires in, short circuit of, or disconnection',
  // 512: 'minus switch is stuck',
  // 1024:  'flange sensor\'s water is frozen',
  // 2048: 'display sensor\'s water is frozen'
};


// DeviceErrorEnum[5] = DeviceErrorEnum[4] + ' & ' + DeviceErrorEnum[1];

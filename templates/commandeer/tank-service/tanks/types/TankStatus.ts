/**
 * @description - current status of the tank
 *   OPERATIONAL - tank is oiled and gassed up and ready to roll
 *   INOPERABLE - tank is broken and should be fixed soon
 *   RETIRED - tank is ready for the museum
 */
export enum TankStatus {
  OPERATIONAL = 'OPERATIONAL',
  INOPERABLE = 'INOPERABLE',
  RETIRED = 'RETIRED',
}

import { TankStatus, TankType } from '..';
import { ITrackable } from '../../_base/ITrackable';

/**
 * @description represents the inteface for a tank
 * @export
 * @interface ITank
 */
export interface ITank extends ITrackable {

  // properties
  name?: string;
  status?: TankStatus;
  type?: TankType;

}

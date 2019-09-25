import { TankStatus, TankType } from './';
import { IPosition } from './IPosition';

/**
 * @description represents the inteface for a tank
 * @export
 * @interface ITank
 */
export interface ITank {

  // properties
  id?: string;
  name?: string;
  status?: TankStatus;
  type?: TankType;
  position?: IPosition;

  // relationships
  positionHistory?: IPosition[];

  // tracking
  createdAt?: Date;
  updatedAt?: Date;

}

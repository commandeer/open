import { TankStatus, TankType } from './';

export interface ITank {
  id?: string;
  name?: string;
  status?: TankStatus;
  type?: TankType;
}

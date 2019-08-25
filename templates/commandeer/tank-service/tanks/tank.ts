import { v4 as uuid } from 'uuid';
import { ITank, TankStatus, TankType } from './types';

const tankSample: ITank = {
  name: 'USS Destroyer',
};

export class Tank implements ITank {

  public id?: string;
  public name?: string;
  public status: TankStatus = TankStatus.OPERATIONAL;
  public type: TankType = TankType.LIGHT;

  public constructor(tank: ITank = tankSample) {
    this.id = (tank.id)
      ? tank.id
      : uuid();

    this.name = tank.name;

    if (tank.status) {
      this.status = tank.status;
    }

    if (tank.type) {
      this.type = tank.type;
    }
  }

}

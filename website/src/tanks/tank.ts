import { v4 as uuid } from 'uuid';
import { ITank, TankStatus, TankType } from '../tanks';

const tankSample: ITank = {
  name: 'US Big Boy',
  status: TankStatus.OPERATIONAL,
  type: TankType.HEAVY,
};

export class Tank implements ITank {

  public id?: string;
  public name?: string;
  public status?: TankStatus = TankStatus.OPERATIONAL;
  public type?: TankType = TankType.LIGHT;

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

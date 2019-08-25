import { v4 as uuid } from 'uuid';
import { ITank, TankType } from './types';

const tankSample: ITank = {
  name: 'USS Destroyer',
};

export class Tank implements ITank {

  public id?: string;
  public name?: string;
  public tankType: TankType = TankType.LIGHT;

  public constructor(tank: ITank = tankSample) {
    this.id = (tank.id)
      ? tank.id
      : uuid();

    this.name = tank.name;

    if (tank.tankType) {
      this.tankType = tank.tankType;
    }
  }

}

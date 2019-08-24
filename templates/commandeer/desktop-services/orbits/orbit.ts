import { v4 as uuid } from 'uuid';
import { IOrbit } from './types/IOrbit';

const orbitSample: IOrbit = {
  name: 'My Test Object',
};

export class Orbit implements IOrbit {

  public id?: string;
  public name?: string;

  public constructor(orbit: IOrbit = orbitSample) {
    this.id = (orbit.id)
      ? orbit.id
      : uuid();

    this.name = orbit.name;
  }

}

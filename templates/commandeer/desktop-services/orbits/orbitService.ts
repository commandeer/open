import { Orbit } from './orbit';

export class OrbitService {

  public async clearCache(): Promise<void> {
    try {
    } catch (ex) {
      throw ex;
    }
  }

  public static getOrbits(): Orbit[] {
    const orbits: Orbit[] = [];
    
    for (let i = 0; i < 10; i++){
      const orbit = new Orbit({ name: `Test ${i}` });

      orbits.push(orbit);
    }

    return orbits;
  }

}

import { Battle } from './battle';
import { BattleType, IPosition } from '.';
import { Tank } from '../tanks/tank';

export class BattleService {

  private static _battles: Battle[] = [];

  public static async clearCache(): Promise<void> {
    try {
      this._battles = [];
    } catch (ex) {
      throw ex;
    }
  }

  /**
   * @description get a battle by it's id
   * @static
   * @param {string} id
   * @returns
   * @memberof BattleService
   */
  public static getBattleById(id: string) {
    let battle = undefined;
    
    if (this._battles && this._battles.length) {
      battle = this._battles.find(b => b.id === id);
    }

    return battle;
  }

  /**
   * @description start a battle of a certain type with opponents
   * @todo do not allow a tank to be in two battles at once
   * @static
   * @param {BattleType} type
   * @param {Tank[]} opponents
   * @param {IPosition} size - size of the battle field in x y coordinates
   * @returns
   * @memberof BattleService
   */
  public static startBattle(type: BattleType, opponents: Tank[], size: IPosition) {
    
    // start a new battle
    const battle = new Battle({
      type,
      opponents,
      size
    });

    // add it to the local cache
    this._battles.push(battle);

    return battle;
  }

  /**
   * @description get a list of current battles
   * @static
   * @returns {Battle[]}
   * @memberof BattleService
   */
  public static getBattles(): Battle[] {
    // if already cached, return the tanks
    if (this._battles && this._battles.length) {
      return this._battles;
    }

    return this._battles;
  }

}

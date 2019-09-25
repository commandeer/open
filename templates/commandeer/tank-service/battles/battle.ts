import { v4 as uuid } from 'uuid';
import { IBattle, BattleStatus } from './types';
import { BattleType } from './types/BattleType';
import { Tank } from '../tanks/tank';

const battleSample: IBattle = {
  name: 'Battle Royale',
  description: 'The battle between many tightens.',
  opponents: [ { id: "1" }, { id: "2" }, { id: "3" }],
  status: BattleStatus.CREATED,
};

export class Battle implements IBattle {

  // properties
  public id?: string;
  public name: string;
  public description: string;
  public status: BattleStatus = BattleStatus.CREATED;
  public type: BattleType = BattleType.ONE_ON_ONE;

  // relationships
  public opponents?: Tank[] = [];

  /**
  * @description - creates an instance of Battle.
  * @param {BattleType} type
  * @param {Tank[]} tanks
  * @memberof Battle
  */
  public constructor(battle: IBattle = battleSample) {

    this.id = (battle.id)
      ? battle.id
      : uuid();

    this.name = battle.name;
    this.description = battle.description;

    this.status = (battle.status)
      ? battle.status
      : BattleStatus.CREATED;

    this.type = (battle.type)
      ? battle.type
      : BattleType.ONE_ON_ONE;

    this.opponents = battle.opponents;

  }

}

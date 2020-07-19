import { ITank } from '../../tanks';
import { BattleStatus, BattleType,  IPosition } from './';
import { ITrackable } from '../../_base/ITrackable';

export interface IBattle extends ITrackable {

  // properties
  name?: string;            // name of the battle
  description?: string;     // descripiton of the battle, usually with opponent names
  status?: BattleStatus;    // current status of the battle
  size?: IPosition;        // x and y size of the board
  type?: BattleType;      // type of battle, ONE_ON_ONE, BATTLE_ROYALE

  // relationships
  opponents?: ITank[];      // different tanks in the game

}

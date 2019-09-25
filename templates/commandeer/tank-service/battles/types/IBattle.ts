import { ITank } from '../../tanks/types/ITank';
import { BattleStatus } from './BattleStatus';
import { IPosition } from './IPosition';
import { ITrackable } from '../../_base/ITrackable';

export interface IBattle extends ITrackable {

  // properties
  name: string;            // name of the battle
  description: string;     // descripiton of the battle, usually with opponent names
  status: BattleStatus;    // current status of the battle
  size?: IPosition;        // x and y size of the board

  // relationships
  opponents: ITank[];      // different tanks in the game

}

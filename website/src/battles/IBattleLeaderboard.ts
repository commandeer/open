import { ITank } from '../tanks/ITank';
import { ITrackable } from '../_base/ITrackable';

// 0,0 top left
export interface IBattleLeaderboard extends ITrackable {

  currentFirstPlace?: ITank;
  currentSecondPlace?: ITank;
  currentThirdPlace?: ITank;

}

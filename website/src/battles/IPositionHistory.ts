import { ITank } from '../tanks/ITank';
import { ITrackable } from '../_base/ITrackable';
import { IPosition } from './IPosition';

export interface IPositionHistory extends ITrackable {

  tank: ITank;

  currentPosition: IPosition;
  previousPosition: IPosition;

}

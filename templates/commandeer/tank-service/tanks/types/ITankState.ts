import { Tank } from '../tank';

export interface ITankState {
  tanks?: Tank[];
  error: boolean;
}

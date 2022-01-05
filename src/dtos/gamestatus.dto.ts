import {PlayerDTO} from './player.dto';

/**
 * Game outcome
 */
export enum Outcome {
  ACTIVE,
  GAME_OVER,
}

/**
 * Game status data tansfer object.
 *
 * @author TopherThomas
 */
export interface GameStatusDTO {
  game_id: number;
  players: PlayerDTO[];
  outcome: Outcome;
  winner?: number[];
}

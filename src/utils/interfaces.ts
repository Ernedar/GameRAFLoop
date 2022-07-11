import {
  PacManStates,
  GhostStates,
  GameStateType,
  ActionType,
  InhabitantNames
} from "./enums";

/* LOOP STATE AND GAME STATE */

export interface gameInterface {
  gameState: GameStateType;
  gameScore: number;
  gameLoaded: boolean;
  gameInterval: number;
  gameDeltaCounter: number;
  gameSpeed: number;
}

export interface movingEntity {
  entityStartPosition: number[];
  entityCurrentPosition: number[];
  entityCurrentDirection: number[];
  entitySpeed: number;
  entityActionCounter: number;
  entityDeltaCounter: number;
}

export interface ghostInterface extends movingEntity {
  ghostState: GhostStates;
}

export interface pacmanInterface extends movingEntity {
  pacmanState: PacManStates;
}

export interface entitiesInterface {
  pacman: pacmanInterface;
  clyde: ghostInterface;
  inky: ghostInterface;
  pinky: ghostInterface;
  blinky: ghostInterface;
}

export interface loopStateInterface {
  game: gameInterface;
  entity: entitiesInterface;
}

/* LOOP ACTIONS */

export interface ResetLoop {
  type: ActionType.ResetLoop;
}

export interface ResetLoopTimers {
  type: ActionType.ResetLoopTimers;
}

export interface ChangeLoopStatus {
  type: ActionType.ChangeLoopStatus;
  payload: GameStateType;
}

export interface UpdateLoop {
  type: ActionType.UpdateLoop;
  payload: {
    speed: number;
  };
}

export interface UpdateEntityActionCounter {
  type: ActionType.UpdateEntityActionCounter;
  payload: {
    entity: InhabitantNames;
    entityActionCounter: number;
    entityDeltaCounter: number;
  };
}

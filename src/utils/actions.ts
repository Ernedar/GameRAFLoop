import { ActionType, GameStateType, InhabitantNames } from "./enums";
import {
  ResetLoop,
  ResetLoopTimers,
  ChangeLoopStatus,
  UpdateLoop,
  UpdateEntityActionCounter
} from "./interfaces";

export const LOOP_ACTIONS = {
  RESET_LOOP: "reset-loop",
  RESET_LOOP_TIMERS: "reset-loop-timers",
  START_LOOP: "start-Loop",
  PAUSE_LOOP: "pause-loop",
  UPDATE_LOOP: "update-loop",
  UPDATE_PACMAN_ACTIONS: "update-pacman-actions",
  UPDATE_CLYDE_ACTIONS: "update-clyde-actions",
  UPDATE_INKY_ACTIONS: "update-inky-actions",
  UPDATE_PINKY_ACTIONS: "update-pinky-actions",
  UPDATE_BLINKY_ACTIONS: "update-blinky-actions"
};

export const resetLoop = (): ResetLoop => ({ type: ActionType.ResetLoop });

export const resetLoopTimersAction = (): ResetLoopTimers => ({
  type: ActionType.ResetLoopTimers
});

export const changeLoopStatus = (
  gameState: GameStateType
): ChangeLoopStatus => ({
  type: ActionType.ChangeLoopStatus,
  payload: gameState
});

export const updateLoop = (loopSpeed: number): UpdateLoop => ({
  type: ActionType.UpdateLoop,
  payload: {
    speed: loopSpeed
  }
});

export const updateEntityCounters = (
  entityIdentity: InhabitantNames,
  entityAC: number,
  entityDC: number
): UpdateEntityActionCounter => ({
  type: ActionType.UpdateEntityActionCounter,
  payload: {
    entity: entityIdentity,
    entityActionCounter: entityAC,
    entityDeltaCounter: entityDC
  }
});

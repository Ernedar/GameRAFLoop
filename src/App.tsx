import React, { useCallback, useEffect, useReducer, useRef } from "react";

import { ActionType, GameStateType, InhabitantNames } from "./utils/enums";
import { loopStateInterface } from "./utils/interfaces";
import { LoopActions } from "./utils/types";
import {
  changeLoopStatus,
  resetLoop,
  resetLoopTimersAction,
  updateEntityCounters,
  updateLoop
} from "./utils/actions";
import { loopIntervalLength } from "./utils/handlers";
import initialGameState from "./initialState";

import "./styles.css";

function loopReducer(
  state: loopStateInterface,
  action: LoopActions
): loopStateInterface {
  switch (action.type) {
    case ActionType.ResetLoopTimers:
      return {
        ...state,
        game: {
          ...state.game,
          gameState: GameStateType.notstarted,
          gameInterval: 0,
          gameSpeed: 0,
          gameDeltaCounter: 0
        },
        entity: {
          ...state.entity,
          pacman: {
            ...state.entity.pacman,
            entityActionCounter: 0,
            entityDeltaCounter: 0
          },
          clyde: {
            ...state.entity.clyde,
            entityActionCounter: 0,
            entityDeltaCounter: 0
          },
          inky: {
            ...state.entity.inky,
            entityActionCounter: 0,
            entityDeltaCounter: 0
          },
          pinky: {
            ...state.entity.pinky,
            entityActionCounter: 0,
            entityDeltaCounter: 0
          },
          blinky: {
            ...state.entity.blinky,
            entityActionCounter: 0,
            entityDeltaCounter: 0
          }
        }
      };
    case ActionType.ResetLoop:
      return {
        ...state,
        game: {
          ...state.game,
          gameInterval: 0,
          gameDeltaCounter: 0
        }
      };
    case ActionType.ChangeLoopStatus:
      return {
        ...state,
        game: {
          ...state.game,
          gameState: action.payload
        }
      };
    case ActionType.UpdateLoop:
      return {
        ...state,
        game: {
          ...state.game,
          gameDeltaCounter: state.game.gameDeltaCounter + action.payload.speed,
          gameSpeed: action.payload.speed
        }
      };
    case ActionType.UpdateEntityActionCounter:
      if (action.payload.entity in InhabitantNames) {
        return {
          ...state,
          entity: {
            ...state.entity,
            [action.payload.entity]: {
              ...state.entity[action.payload.entity],
              entityDeltaCounter: action.payload.entityDeltaCounter,
              entityActionCounter:
                state.entity[action.payload.entity].entityActionCounter +
                action.payload.entityActionCounter
            }
          }
        };
      } else {
        return state;
      }
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(loopReducer, initialGameState);

  const maxIntervalLength = loopIntervalLength([
    state.entity.pacman.entitySpeed,
    state.entity.clyde.entitySpeed,
    state.entity.inky.entitySpeed,
    state.entity.pinky.entitySpeed,
    state.entity.blinky.entitySpeed
  ]);

  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  function loopReset() {
    dispatch(resetLoop());
    requestRef.current = undefined;
    previousTimeRef.current = undefined;
  }

  function entityDispatcher(
    entityIdentity: InhabitantNames,
    deltaTime: number
  ) {
    let newEntityDC =
      state.entity[entityIdentity].entityDeltaCounter + deltaTime;
    if (newEntityDC >= state.entity[entityIdentity].entitySpeed) {
      newEntityDC = newEntityDC - state.entity[entityIdentity].entitySpeed;

      dispatch(updateEntityCounters(entityIdentity, 1, newEntityDC));
    } else {
      dispatch(updateEntityCounters(entityIdentity, 0, newEntityDC));
    }
  }

  const gameLoop = useCallback(
    (time: number) => {
      if (previousTimeRef.current !== undefined && state !== undefined) {
        const deltaTime = time - previousTimeRef.current;

        if (state.game.gameDeltaCounter >= maxIntervalLength) {
          loopReset();
        }
        dispatch(updateLoop(deltaTime));

        entityDispatcher(InhabitantNames.pacman, deltaTime);
        entityDispatcher(InhabitantNames.clyde, deltaTime);
        entityDispatcher(InhabitantNames.inky, deltaTime);
        entityDispatcher(InhabitantNames.pinky, deltaTime);
        entityDispatcher(InhabitantNames.blinky, deltaTime);

        console.table([
          [
            "Entity",
            "Game Timer",
            "Pacman Timer",
            "Clyde Timer",
            "Inky Timer",
            "Pinky Timer",
            "Blinky Timer"
          ],

          [
            "Interval Speed",
            maxIntervalLength,
            state.entity.pacman.entitySpeed,
            state.entity.clyde.entitySpeed,
            state.entity.inky.entitySpeed,
            state.entity.pinky.entitySpeed,
            state.entity.blinky.entitySpeed
          ],
          [
            "Current Delta",
            parseInt(state.game.gameDeltaCounter.toFixed(2), 10),
            parseInt(state.entity.pacman.entityDeltaCounter.toFixed(2), 10),
            parseInt(state.entity.clyde.entityDeltaCounter.toFixed(2), 10),
            parseInt(state.entity.inky.entityDeltaCounter.toFixed(2), 10),
            parseInt(state.entity.pinky.entityDeltaCounter.toFixed(2), 10),
            parseInt(state.entity.blinky.entityDeltaCounter.toFixed(2), 10)
          ],
          [
            "Actions Counter",
            state.game.gameInterval,
            state.entity.pacman.entityActionCounter,
            state.entity.clyde.entityActionCounter,
            state.entity.inky.entityActionCounter,
            state.entity.pinky.entityActionCounter,
            state.entity.blinky.entityActionCounter
          ]
        ]);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(gameLoop);
    },
    [state, maxIntervalLength]
  );

  useEffect(() => {
    if (state.game.gameState === GameStateType.running) {
      requestRef.current = requestAnimationFrame(gameLoop);
    } else {
      requestRef.current = undefined;
      previousTimeRef.current = undefined;
    }
    return () => {
      if (requestRef.current === undefined) {
        return;
      }
      cancelAnimationFrame(requestRef.current);
    };
  }, [state.game.gameState, gameLoop]);

  useEffect(() => {
    if (state.entity.pacman.entityActionCounter !== 0) {
      console.log(
        "new pacman Action Triggered. counter: " +
          state.entity.pacman.entityActionCounter
      );
    }
  }, [state.entity.pacman.entityActionCounter]);

  return (
    <div className="App">
      <p>Current Game State: {state.game.gameState}</p>
      <button onClick={() => dispatch(changeLoopStatus(GameStateType.running))}>
        Start
      </button>
      <button onClick={() => dispatch(changeLoopStatus(GameStateType.paused))}>
        Pause
      </button>
      <button onClick={() => dispatch(resetLoopTimersAction())}>Reset</button>
      <div className="graph-table-wrapper">
        <div>
          <p>
            Overall interval, speed:
            <strong> {state.game.gameSpeed.toFixed(2)}</strong>,
            fullIntervalLength:<strong> {maxIntervalLength}</strong>,
            intervalSteps:{" "}
            <strong>
              {(maxIntervalLength / state.game.gameSpeed).toFixed(0)}
            </strong>
            , currentIntervalLength:
            <strong> {state.game.gameDeltaCounter.toFixed(0)}</strong>
          </p>
          <div className="graph-wrapper">
            <div
              className="graph"
              style={{
                width:
                  (state.game.gameDeltaCounter / maxIntervalLength) * 100 + "%"
              }}
            ></div>
          </div>
        </div>
        <div>
          <p>
            pacman, speed:
            <strong> {state.entity.pacman.entitySpeed}</strong>, wantedActions
            per fullIntervalLength:
            <strong>
              {" "}
              {maxIntervalLength / state.entity.pacman.entitySpeed}
            </strong>
            , generatedActions:
            <strong> {state.entity.pacman.entityActionCounter}</strong>
          </p>
          <div className="graph-wrapper">
            <div
              className="graph"
              style={{
                width:
                  (state.entity.pacman.entityActionCounter /
                    (maxIntervalLength / state.entity.pacman.entitySpeed)) *
                    100 +
                  "%"
              }}
            ></div>
          </div>
        </div>
        <div>
          <p>
            clyde, speed:
            <strong> {state.entity.clyde.entitySpeed}</strong>, wantedActions:
            <strong>
              {" "}
              {maxIntervalLength / state.entity.clyde.entitySpeed}
            </strong>
            , generatedActions:
            <strong> {state.entity.clyde.entityActionCounter}</strong>
          </p>
          <div className="graph-wrapper">
            <div
              className="graph"
              style={{
                width:
                  (state.entity.clyde.entityActionCounter /
                    (maxIntervalLength / state.entity.clyde.entitySpeed)) *
                    100 +
                  "%"
              }}
            ></div>
          </div>
        </div>
        <div>
          <p>
            Inky, speed: <strong>{state.entity.inky.entitySpeed}</strong>,
            wantedActions:
            <strong>
              {" "}
              {maxIntervalLength / state.entity.inky.entitySpeed}
            </strong>
            , generatedActions:
            <strong> {state.entity.inky.entityActionCounter}</strong>
          </p>
          <div className="graph-wrapper">
            <div
              className="graph"
              style={{
                width:
                  (state.entity.inky.entityActionCounter /
                    (maxIntervalLength / state.entity.inky.entitySpeed)) *
                    100 +
                  "%"
              }}
            ></div>
          </div>
        </div>
        <div>
          <p>
            Pinky, speed: <strong>{state.entity.pinky.entitySpeed}</strong>,
            wantedActions:
            <strong>
              {" "}
              {maxIntervalLength / state.entity.pinky.entitySpeed}
            </strong>
            , generatedActions:
            <strong> {state.entity.pinky.entityActionCounter}</strong>
          </p>
          <div className="graph-wrapper">
            <div
              className="graph"
              style={{
                width:
                  (state.entity.pinky.entityActionCounter /
                    (maxIntervalLength / state.entity.pinky.entitySpeed)) *
                    100 +
                  "%"
              }}
            ></div>
          </div>
        </div>
        <div>
          <p>
            Blinky, speed: <strong>{state.entity.blinky.entitySpeed}</strong>,
            wantedActions:
            <strong>
              {" "}
              {maxIntervalLength / state.entity.blinky.entitySpeed}
            </strong>
            , generatedActions:
            <strong> {state.entity.blinky.entityActionCounter}</strong>
          </p>
          <div className="graph-wrapper">
            <div
              className="graph"
              style={{
                width:
                  (state.entity.blinky.entityActionCounter /
                    (maxIntervalLength / state.entity.blinky.entitySpeed)) *
                    100 +
                  "%"
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

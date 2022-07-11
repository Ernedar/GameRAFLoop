import {
  loopStateInterface,
  ResetLoop,
  ResetLoopTimers,
  ChangeLoopStatus,
  UpdateLoop,
  UpdateEntityActionCounter
} from "./interfaces";

export type loopPayloadType = Partial<loopStateInterface> & {};

export type LoopActions =
  | ResetLoop
  | ResetLoopTimers
  | ChangeLoopStatus
  | UpdateLoop
  | UpdateEntityActionCounter;

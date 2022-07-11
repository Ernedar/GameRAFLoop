export enum InhabitantNames {
  pacman = "pacman",
  clyde = "clyde",
  pinky = "pinky",
  blinky = "blinky",
  inky = "inky"
}

export enum PacManStates {
  idle = "idle",
  eating = "eating",
  dead = "dead"
}

export enum GhostStates {
  idle = "idle",
  hunting = "hunting",
  scared = "scared",
  dead = "dead"
}

export enum GhostBehavior {
  test = "test",
  clyde = "clyde",
  pinky = "pinky",
  blinky = "blinky",
  inky = "inky"
}

export enum GameStateType {
  notstarted = "not-started",
  running = "running",
  paused = "paused",
  finished = "finished",
  lost = "lost"
}

export enum ActionType {
  ResetLoop,
  ResetLoopTimers,
  ChangeLoopStatus,
  UpdateLoop,
  UpdateEntityActionCounter
}

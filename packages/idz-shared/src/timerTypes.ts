export enum TimerStatus {
  Active,
  Paused,
  Stopped
}

export enum TimerEventTypes {
  Started = 'timer-started',
  Ticked = 'timer-ticked',
  Paused = 'timer-paused',
  Resumed = 'timer-resumed',
  Finished = 'timer-finished',
  Stopped = 'timer-stopped'
}

export interface TimerState {
  duration: number
  status: TimerStatus
  remaining: number
}

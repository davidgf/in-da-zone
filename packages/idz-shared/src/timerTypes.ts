export enum TimerStatus {
  Active,
  Paused,
  Stopped
}

export interface TimerState {
  duration: number
  status: TimerStatus
  remaining: number
}

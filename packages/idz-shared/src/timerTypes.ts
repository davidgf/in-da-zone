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

export enum PomodoroCycleStatus {
  Work,
  Break
}

export interface PomodoroTimerState {
  cycles: number
  currentCycle: number
  currentCycleStatus: PomodoroCycleStatus
  timer: TimerState
}

export enum PomodoroEvents {
  Started = 'pomodoro-started',
  Ticked = 'pomodoro-ticked',
  Finished = 'pomodoro-finished',
  Stopped = 'pomodoro-stopped',
  CycleStarted = 'pomodoro-cycle-started',
  BreakStarted = 'pomodoro-break-started'
}

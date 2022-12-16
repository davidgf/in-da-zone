import { PomodoroTimerState } from './timerTypes'

export interface Settings {
  blockedHosts: string[]
  pomodoroTimerState: PomodoroTimerState
}

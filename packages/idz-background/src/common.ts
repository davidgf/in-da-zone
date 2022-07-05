/* eslint-disable @typescript-eslint/consistent-type-definitions, @typescript-eslint/promise-function-async */
import { TimerState } from './Timer'

export type Settings = {
  blockedHosts: string[]
  timerState?: TimerState
}

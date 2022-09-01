/* eslint-disable @typescript-eslint/consistent-type-definitions, @typescript-eslint/promise-function-async */
import { TimerState } from 'idz-shared'

export type Settings = {
  blockedHosts: string[]
  timerState?: TimerState
  foo?: string
}

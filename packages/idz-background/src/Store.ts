/* eslint-disable @typescript-eslint/consistent-type-definitions, @typescript-eslint/promise-function-async */
import * as browser from 'webextension-polyfill'
import PomodoroTimer from './PomodoroTimer'
import { PomodoroTimerState, Settings } from 'idz-shared'

const defaultTimer: PomodoroTimer = new PomodoroTimer()
const defaultSettings: Settings = { blockedHosts: [], pomodoroTimerState: defaultTimer.state }

export default class Store {
  settings: Settings
  storageClient: browser.Storage.LocalStorageArea

  constructor (
    settings = defaultSettings,
    storageClient = browser.storage.local
  ) {
    this.settings = settings
    this.storageClient = storageClient
  }

  async load (): Promise<void> {
    await this.storageClient.get()
      .then(data => {
        const blockedHosts = data.blockedHosts !== undefined ? data.blockedHosts : []
        const pomodoroTimerState = data.pomodoroTimerState !== undefined ? data.pomodoroTimerState : {}
        this.settings = { blockedHosts, pomodoroTimerState }
      })
  }

  save (newSettings: { blockedHosts?: string[], pomodoroTimerState?: PomodoroTimerState }): Promise<void> {
    return this.storageClient.set(newSettings)
      .then(data => {
        this.settings = { ...this.settings, ...newSettings }
      })
      .catch(err => console.error('[BACKGROUND] ERROR SAVING STATE', err))
  }
}

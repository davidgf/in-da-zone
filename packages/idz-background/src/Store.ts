/* eslint-disable @typescript-eslint/consistent-type-definitions, @typescript-eslint/promise-function-async */
import * as browser from 'webextension-polyfill'
import Timer from './Timer'
import { TimerState, Settings } from 'idz-shared'

const defaultTimer: Timer = new Timer()
const defaultSettings: Settings = { blockedHosts: [], timerState: defaultTimer.state }

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
        const timerState = data.timerState !== undefined ? data.timerState : {}
        this.settings = { blockedHosts, timerState }
      })
  }

  save (newSettings: { blockedHosts?: string[], timerState?: TimerState }): Promise<void> {
    return this.storageClient.set(newSettings)
      .then(data => {
        this.settings = { ...this.settings, ...newSettings }
        console.log('SAVED NEW STATE', this.settings, data)
      })
      .catch(err => console.error('ERROR SAVING STATE', err))
  }
}

/* eslint-disable @typescript-eslint/consistent-type-definitions, @typescript-eslint/promise-function-async */
import * as browser from 'webextension-polyfill'
import { TimerState } from 'idz-shared'
import { Settings } from './common'

const defaultSettings: Settings = { blockedHosts: ['twitter.com'] }

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
    await this.storageClient.get('blockedHosts')
      .then(data => {
        const blockedHosts = data.blockedHosts !== undefined ? JSON.parse(data.blockedHosts) : []
        this.settings = { ...this.settings, ...{ blockedHosts } }
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

/* eslint-disable @typescript-eslint/consistent-type-definitions, @typescript-eslint/promise-function-async */
import * as browser from 'webextension-polyfill'
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
    const all = await this.storageClient.get()
    console.log('all: ', all)

    await this.storageClient.get('blockedHosts')
      .then(data => {
        console.log('>>>>>>>>>>>>>>>>>>>>>>>> Loaded data: ', data)
        const blockedHosts = JSON.parse(data.blockedHosts)
        this.settings = { ...this.settings, ...{ blockedHosts } }
      })
  }

  save (newSettings: Settings): Promise<void> {
    return this.storageClient.set(newSettings)
      .then(() => {
        this.settings = { ...this.settings, ...newSettings }
      })
  }
}

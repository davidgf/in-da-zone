/* eslint-disable @typescript-eslint/no-floating-promises */

import BackgroundController from './BackgroundController'
import Store from './Store'
import * as browser from 'webextension-polyfill'

export async function startController (): Promise<void> {
  const store = new Store()
  await store.load()
  const controller = new BackgroundController({ store })
  browser.runtime.onMessage.addListener((request, sender) => {
    if (request.startBlocking === true) {
      controller.startBlocking()
    }
  })
}

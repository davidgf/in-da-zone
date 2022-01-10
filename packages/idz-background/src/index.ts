/* eslint-disable @typescript-eslint/no-floating-promises */

import BackgroundController from './BackgroundController'
import Store from './Store'

export async function startController (): Promise<void> {
  const store = new Store()
  await store.load()
  const controller = new BackgroundController({ store })
  controller.startBlocking()
}

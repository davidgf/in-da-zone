/* eslint-disable @typescript-eslint/no-floating-promises */

import BackgroundController from './BackgroundController'
import Store from './Store'
import Timer from './Timer'

export async function startController (): Promise<void> {
  const store = new Store()
  await store.load()
  const timer = new Timer({ duration: 15 })
  const controller = new BackgroundController({ store, timer })
  controller.startBlocking()
}

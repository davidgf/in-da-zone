import * as browser from 'webextension-polyfill'
import { TimerState, TimerEventTypes as TimerEvent } from 'idz-shared'
import Store from './Store'
import Timer from './Timer'

export default class BackgroundController {
  store: Store
  timer: Timer
  isBlocking: boolean

  constructor ({ store }: { store: Store }) {
    this.store = store
    this.isBlocking = false
  }

  startFocusTimer (): void {
    this.timer = new Timer({ duration: 30 })
    this.timer.on(TimerEvent.Started, data => this.#handleTimerEvent(TimerEvent.Started, data))
    this.timer.on(TimerEvent.Ticked, data => this.#handleTimerEvent(TimerEvent.Ticked, data))
    this.timer.on(TimerEvent.Paused, data => this.#handleTimerEvent(TimerEvent.Paused, data))
    this.timer.on(TimerEvent.Resumed, data => this.#handleTimerEvent(TimerEvent.Resumed, data))
    this.timer.on(TimerEvent.Finished, data => {
      this.isBlocking = false
      this.#handleTimerEvent(TimerEvent.Finished, data)
    })
    this.timer.on(TimerEvent.Stopped, data => this.#handleTimerEvent(TimerEvent.Stopped, data))
    this.timer.start()
  }

  #handleTimerEvent (eventType: TimerEvent, timerState: TimerState): void {
    this.#persistTimerState(timerState)
    void browser.runtime.sendMessage({ eventType, timerState })
      .catch(err => console.log('Error sending message', err))
  }

  #persistTimerState (timerState: TimerState): void {
    void this.store.save({ timerState })
  }

  startBlocking (): void {
    if (!this.isBlocking) {
      this.isBlocking = true
      browser.tabs.onUpdated.addListener(this.handleTabUpdated.bind(this))
      this.startFocusTimer()
    }
  }

  stopBlocking (): void {
    if (this.isBlocking) {
      this.isBlocking = false
      browser.tabs.onUpdated.removeListener(this.handleTabUpdated.bind(this))
      this.timer.removeAllListeners()
    }
  }

  isHostnameBlocked (hostname: string): boolean {
    const blockedSitesRegEx = this.store.settings.blockedHosts.map(host => new RegExp(`(www.)?${host}`))
    return blockedSitesRegEx.some(blockedSiteRE => hostname.match(blockedSiteRE))
  }

  async handleTabUpdated (tabId: number, changeInfo: { url?: string }): Promise<void> {
    if (changeInfo.url != null) {
      await this.store.load()
      const url = new URL(changeInfo.url)
      if (this.isBlocking && this.isHostnameBlocked(url.hostname)) {
        const redirectUrl = browser.runtime.getURL('/static/redirect/redirect.html')
        await browser.tabs.update(tabId, { url: redirectUrl })
      }
    }
  }
}

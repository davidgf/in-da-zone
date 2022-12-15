import * as browser from 'webextension-polyfill'
import { TimerState, PomodoroTimerState, PomodoroEvents } from 'idz-shared'
import Store from './Store'
import Timer from './Timer'
import PomodoroTimer from './PomodoroTimer'

export default class BackgroundController {
  store: Store
  timer: Timer
  pomodoroTimer: PomodoroTimer
  isBlocking: boolean

  constructor ({ store }: { store: Store }) {
    this.store = store
    this.isBlocking = false
  }

  #persistTimerState (timerState: TimerState): void {
    void this.store.save({ timerState })
  }

  startPomodoroTimer (): void {
    this.pomodoroTimer = new PomodoroTimer({ duration: 20, breakDuration: 5, longBreakDuration: 10 })
    this.pomodoroTimer.on(PomodoroEvents.Started, data => this.#handlePomodoroTimerEvent(PomodoroEvents.Started, data))
    this.pomodoroTimer.on(PomodoroEvents.Ticked, data => this.#handlePomodoroTimerEvent(PomodoroEvents.Ticked, data))
    this.pomodoroTimer.on(PomodoroEvents.Finished, data => {
      this.isBlocking = false
      this.#handlePomodoroTimerEvent(PomodoroEvents.Finished, data)
    })
    this.pomodoroTimer.on(PomodoroEvents.Stopped, data => this.#handlePomodoroTimerEvent(PomodoroEvents.Stopped, data))
    this.pomodoroTimer.on(PomodoroEvents.CycleStarted, data => this.#handlePomodoroTimerEvent(PomodoroEvents.Stopped, data))
    this.pomodoroTimer.on(PomodoroEvents.BreakStarted, data => this.#handlePomodoroTimerEvent(PomodoroEvents.Stopped, data))
    this.pomodoroTimer.start()
  }

  #handlePomodoroTimerEvent (eventType: PomodoroEvents, pomodoroState: PomodoroTimerState): void {
    console.log('[BACKGROUND] #handlePomodoroTimerEvent', eventType, pomodoroState)
    this.#persistTimerState(pomodoroState.timer)
    void browser.runtime.sendMessage({ eventType, pomodoroState })
      .catch(err => console.log('[BACKGROUND] Error sending message', err))
  }

  startBlocking (): void {
    if (!this.isBlocking) {
      this.isBlocking = true
      browser.tabs.onUpdated.addListener(this.handleTabUpdated.bind(this))
      this.startPomodoroTimer()
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

import * as browser from 'webextension-polyfill'
import { PomodoroTimerState, PomodoroEvents, PomodoroCycleStatus } from 'idz-shared'
import Store from './Store'
import Timer from './Timer'
import PomodoroTimer from './PomodoroTimer'

const badges = {
  work: '🚫',
  break: '✅',
  clear: ''
}
export default class BackgroundController {
  store: Store
  timer: Timer
  pomodoroTimer: PomodoroTimer

  constructor ({ store }: { store: Store }) {
    this.store = store
  }

  startPomodoroTimer (): void {
    this.pomodoroTimer = new PomodoroTimer()
    this.pomodoroTimer.on(PomodoroEvents.Started, data => this.#handlePomodoroTimerStartedEvent(PomodoroEvents.Started, data))
    this.pomodoroTimer.on(PomodoroEvents.Ticked, data => this.#handlePomodoroTimerGenericEvent(PomodoroEvents.Ticked, data))
    this.pomodoroTimer.on(PomodoroEvents.Finished, data => this.#handlePomodoroTimerFinishedEvent(PomodoroEvents.Finished, data))
    this.pomodoroTimer.on(PomodoroEvents.Stopped, data => this.#handlePomodoroTimerFinishedEvent(PomodoroEvents.Stopped, data))
    this.pomodoroTimer.on(PomodoroEvents.CycleStarted, data => this.#handlePomodoroCycleStartedEvent(PomodoroEvents.CycleStarted, data))
    this.pomodoroTimer.on(PomodoroEvents.BreakStarted, data => this.#handlePomodoroBreakStartedEvent(PomodoroEvents.BreakStarted, data))
    this.pomodoroTimer.start()
  }

  startBlocking (): void {
    browser.tabs.onUpdated.addListener(this.handleTabUpdated.bind(this))
    this.startPomodoroTimer()
  }

  async stopBlocking (): Promise<void> {
    this.pomodoroTimer?.stop()
    this.pomodoroTimer?.removeAllListeners()
    browser.tabs.onUpdated.removeListener(this.handleTabUpdated.bind(this))
    await this.store.clearPomodoroTimer()
  }

  isHostnameBlocked (hostname: string): boolean {
    const blockedSitesRegEx = this.store.settings.blockedHosts.map(host => new RegExp(`(www.)?${host}`))
    return blockedSitesRegEx.some(blockedSiteRE => hostname.match(blockedSiteRE))
  }

  async handleTabUpdated (tabId: number, changeInfo: { url?: string }): Promise<void> {
    if (changeInfo.url != null) {
      await this.store.load()
      const url = new URL(changeInfo.url)
      const { currentCycleStatus } = this.store.settings.pomodoroTimerState
      if (currentCycleStatus === PomodoroCycleStatus.Work && this.isHostnameBlocked(url.hostname)) {
        const redirectUrl = browser.runtime.getURL('/static/redirect/redirect.html')
        await browser.tabs.update(tabId, { url: redirectUrl })
      }
    }
  }

  #persistTimerState (pomodoroTimerState: PomodoroTimerState): void {
    void this.store.save({ pomodoroTimerState })
  }

  #setIconBadge (badgeText: string): void {
    void browser.browserAction.setBadgeText({ text: badgeText })
      .catch(err => console.log('[BACKGROUND] Error setting badge text', err))
    void browser.browserAction.setBadgeBackgroundColor({ color: 'white' })
      .catch(err => console.log('[BACKGROUND] Error setting badge background color', err))
  }

  #handlePomodoroTimerStartedEvent (eventType: PomodoroEvents, pomodoroState: PomodoroTimerState): void {
    this.#handlePomodoroTimerGenericEvent(eventType, pomodoroState)
    this.#setIconBadge(badges.work)
  }

  #handlePomodoroTimerFinishedEvent (eventType: PomodoroEvents, pomodoroState: PomodoroTimerState): void {
    this.#handlePomodoroTimerGenericEvent(eventType, pomodoroState)
    this.#setIconBadge(badges.clear)
  }

  #handlePomodoroCycleStartedEvent (eventType: PomodoroEvents, pomodoroState: PomodoroTimerState): void {
    this.#handlePomodoroTimerGenericEvent(eventType, pomodoroState)
    this.#setIconBadge(badges.work)
  }

  #handlePomodoroBreakStartedEvent (eventType: PomodoroEvents, pomodoroState: PomodoroTimerState): void {
    this.#handlePomodoroTimerGenericEvent(eventType, pomodoroState)
    this.#setIconBadge(badges.break)
  }

  #handlePomodoroTimerGenericEvent (eventType: PomodoroEvents, pomodoroState: PomodoroTimerState): void {
    this.#persistTimerState(pomodoroState)
    void browser.runtime.sendMessage({ eventType, pomodoroState })
      .catch(err => console.log('[BACKGROUND] Error sending message', err))
  }
}

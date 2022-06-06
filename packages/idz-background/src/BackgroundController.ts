import * as browser from 'webextension-polyfill'
import Store from './Store'
import Timer from './Timer'

export default class BackgroundController {
  store: Store
  timer: Timer
  isBlocking: boolean

  constructor ({ store, timer }: { store: Store, timer: Timer }) {
    this.store = store
    this.timer = timer
    this.isBlocking = false
  }

  startBlocking (): void {
    this.isBlocking = true
    this.timer.start()
    browser.tabs.onUpdated.addListener(this.handleTabUpdated.bind(this))
  }

  stopBlocking (): void {
    this.isBlocking = false
    browser.tabs.onUpdated.removeListener(this.handleTabUpdated.bind(this))
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

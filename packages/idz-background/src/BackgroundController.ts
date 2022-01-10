import * as browser from 'webextension-polyfill'
import Store from './Store'

export default class BackgroundController {
  store: Store
  isBlocking: boolean

  constructor ({ store }: { store: Store }) {
    this.store = store
    this.isBlocking = false
  }

  startBlocking (): void {
    this.isBlocking = true
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
    console.log('CHECKING', tabId, changeInfo)
    if (changeInfo.url != null) {
      console.log(`Tab: ${tabId} URL changed to ${changeInfo.url}`)
      const url = new URL(changeInfo.url)
      console.log('url.hostname: ', url.hostname)
      console.log('isBlocking: ', this.isBlocking)
      if (this.isBlocking && this.isHostnameBlocked(url.hostname)) {
        const redirectUrl = browser.runtime.getURL('/static/redirect/redirect.html')
        console.log('redirectUrl: ', redirectUrl)
        await browser.tabs.update(tabId, { url: redirectUrl })
      }
    }
  }
}

const BLOCKED_SITES_STORAGE_KEY = 'Blocked-Sites'
const BLOCKING_STATUS_STORAGE_KEY = 'isBlocking'

const BLOCKING_STATUS = {
  ACTIVE: 'active',
  STOPPED: 'stopped',
  PAUSED: 'paused'
}
const initialState = {
  blockedHosts: [],
  blockingStatus: BLOCKING_STATUS.STOPPED
}

const getBlockedSitesAndStatus = () => {
  return browser.storage.local.get([BLOCKED_SITES_STORAGE_KEY, BLOCKING_STATUS_STORAGE_KEY])
    .then(data => ({
      blockedSites: data[BLOCKED_SITES_STORAGE_KEY],
      isBlocking: data[BLOCKING_STATUS_STORAGE_KEY]
    }))
}

function isHostnameBlocked (hostname, blockedSites) {
  const blockedSitesRegEx = blockedSites.map(host => new RegExp(`(www\.)?${host}`))
  return blockedSitesRegEx.some(blockedSiteRE => hostname.match(blockedSiteRE))
}

async function handleUpdated (tabId, changeInfo) {
  if (changeInfo.url) {
    console.log('Tab: ' + tabId +
      ' URL changed to ' + changeInfo.url)
    const { blockedSites, isBlocking } = await getBlockedSitesAndStatus()
    const url = new URL(changeInfo.url)
    console.log('url.hostname: ', url.hostname)
    console.log('blockedSites: ', blockedSites)
    console.log('isBlocking: ', isBlocking)
    if (isBlocking && isHostnameBlocked(url.hostname, blockedSites)) {
      const redirectUrl = browser.extension.getURL('/redirect/redirect.html')
      console.log('redirectUrl: ', redirectUrl)
      browser.tabs.update(tabId, { url: redirectUrl })
    }
  }
}

browser.tabs.onUpdated.addListener(handleUpdated)

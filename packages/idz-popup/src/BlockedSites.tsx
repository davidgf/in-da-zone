import React, { useState, useEffect } from 'react'
import * as browser from 'webextension-polyfill'

const BLOCKED_HOSTS_KEY = 'blockedHosts'

export default function BlockedSites (): JSX.Element {
  const [blockedSites, setBlockedSites] = useState<String[]>([])

  function blockedSitesChanged (change: React.FocusEvent<HTMLTextAreaElement>): void {
    const { value } = change.target
    setBlockedSites(value.split('\n').map(site => site.trim()).filter(site => site !== ''))
  }

  useEffect(() => {
    browser.storage.local.get(BLOCKED_HOSTS_KEY)
      .then(result => setBlockedSites(JSON.parse(result[BLOCKED_HOSTS_KEY])))
      .catch(err => console.error('Error loading blocked sites', err))
  }, [])

  useEffect(() => {
    browser.storage.local.set({ [BLOCKED_HOSTS_KEY]: JSON.stringify(blockedSites) })
      .catch(err => console.error('Error saving blocked sites', err))
  })

  return (
    <div>
      <textarea onBlur={blockedSitesChanged} defaultValue={blockedSites.join('\n')} />
      <button>Enter da zone</button>
    </div>
  )
}

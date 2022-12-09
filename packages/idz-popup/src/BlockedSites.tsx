import React, { useState, useEffect } from 'react'
import * as browser from 'webextension-polyfill'
import { TimerState } from 'idz-shared'

const BLOCKED_HOSTS_KEY = 'blockedHosts'

export default function BlockedSites (): JSX.Element {
  const [blockedSites, setBlockedSites] = useState<String[]>([])
  const [timerState, setTimerState] = useState<TimerState>()

  function blockedSitesChanged (change: React.FocusEvent<HTMLTextAreaElement>): void {
    const { value } = change.target
    setBlockedSites(value.split('\n').map(site => site.trim()).filter(site => site !== ''))
  }

  function startBlocking (): void {
    void browser.runtime.sendMessage({ startBlocking: true })
  }

  browser.runtime.onMessage.addListener((request, sender) => {
    console.log('LISTENED FROM POPUP', request, sender)
  })

  useEffect(() => {
    browser.storage.local.get()
      .then(result => {
        console.log('LOADED Blocked Sites', result)
        const persistedBlockedSites = (result[BLOCKED_HOSTS_KEY] !== undefined)
          ? result[BLOCKED_HOSTS_KEY]
          : []
        setBlockedSites(persistedBlockedSites)
        console.log('result.timerState: ', result.timerState)
        const persistedTimerState = (result.timerState !== undefined)
          ? result.timerState
          : {}
        setTimerState(persistedTimerState)
      })
      .catch(err => console.error('Error loading blocked sites', err))
  }, [])

  useEffect(() => {
    browser.storage.local.set({ [BLOCKED_HOSTS_KEY]: blockedSites })
      .catch(err => console.error('Error saving blocked sites', err))
  })

  return (
    <div>
      <textarea onBlur={blockedSitesChanged} defaultValue={blockedSites.join('\n')} />
      <p>{JSON.stringify(timerState)}</p>
      <button onClick={startBlocking}>Enter da zone</button>
    </div>
  )
}

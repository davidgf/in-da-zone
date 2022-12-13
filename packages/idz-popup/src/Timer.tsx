import React, { useState, useEffect } from 'react'
import * as browser from 'webextension-polyfill'
import { TimerState } from 'idz-shared'

export default function Timer (): JSX.Element {
  const [timerState, setTimerState] = useState<TimerState>()

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
        const persistedTimerState = (result.timerState !== undefined)
          ? result.timerState
          : {}
        setTimerState(persistedTimerState)
      })
      .catch(err => console.error('Error loading blocked sites', err))
  }, [])

  return (
    <div>
      <h2>Hi from the timer</h2>
      <p>{JSON.stringify(timerState)}</p>
      <button onClick={startBlocking}>Enter da zone</button>
    </div>
  )
}

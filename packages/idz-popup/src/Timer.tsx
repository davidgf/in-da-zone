import React, { useState, useEffect } from 'react'
import * as browser from 'webextension-polyfill'
import { TimerState, TimerStatus } from 'idz-shared'

const defaultState: TimerState = {
  duration: 0,
  remaining: 0,
  status: TimerStatus.Stopped
}

export default function Timer (): JSX.Element {
  const [timerState, setTimerState] = useState<TimerState>(defaultState)
  const [remainingMinutes, setRemainingMinutes] = useState<number>(0)
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0)

  useEffect(() => {
    setRemainingMinutes(Math.floor(timerState.remaining / 60))
    setRemainingSeconds(timerState.remaining % 60)
  })

  function startBlocking (): void {
    void browser.runtime.sendMessage({ startBlocking: true })
  }

  browser.runtime.onMessage.addListener(request => {
    setTimerState(request.timerState)
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
      <p>{remainingMinutes}:{remainingSeconds}</p>
      <p>{JSON.stringify(timerState)}</p>
      <button onClick={startBlocking}>Enter da zone</button>
    </div>
  )
}

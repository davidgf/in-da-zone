import React, { useState, useEffect } from 'react'
// @ts-expect-error
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import BlockedSites from './BlockedSites'
import Timer from './Timer'
import 'bootstrap/dist/css/bootstrap.min.css'
import { PomodoroTimerState, PomodoroCycleStatus, TimerStatus } from 'idz-shared'
import * as browser from 'webextension-polyfill'
import './App.css'

const defaultState: PomodoroTimerState = {
  currentCycle: 0,
  cycles: 4,
  currentCycleStatus: PomodoroCycleStatus.Break,
  timer: {
    duration: 0,
    remaining: 0,
    status: TimerStatus.Stopped
  }
}
function App (): JSX.Element {
  const [pomodoroTimerState, setPomodoroTimerState] = useState<PomodoroTimerState>(defaultState)
  const [blockedSites, setBlockedSites] = useState<String[]>([])

  useEffect(() => {
    browser.storage.local.get()
      .then(result => {
        const persistedPomodoroTimerState = (result.pomodoroTimerState !== undefined)
          ? result.pomodoroTimerState
          : defaultState
        console.log('[POPUP] Loading timer state:', persistedPomodoroTimerState)
        setPomodoroTimerState(persistedPomodoroTimerState)
      })
      .catch(err => console.error('[POPUP] Error storing timer state', err))
  }, [])

  useEffect(() => {
    browser.storage.local.get()
      .then(result => {
        const persistedBlockedSites = (result.blockedHosts !== undefined)
          ? result.blockedHosts
          : []
        console.log('[POPUP] Persisting blocked hosts:', persistedBlockedSites)
        setBlockedSites(persistedBlockedSites)
      })
      .catch(err => console.error('[POPUP] Error storing blocked sites', err))

    browser.runtime.onMessage.addListener(request => {
      console.log('[POPUP] Message listened from popup', request)
      setPomodoroTimerState(request.pomodoroState)
    })
  }, [])

  useEffect(() => {
    browser.storage.local.set({ blockedHosts: blockedSites })
      .catch(err => console.error('[POPUP] Error saving blocked sites', err))
  })

  return (
    <div className='App'>
      <Tabs>
        <header className='App-header'>
          <TabList>
            <Tab>Timer</Tab>
            <Tab>Settings</Tab>
          </TabList>
        </header>
        <TabPanel>
          <Timer pomodoroTimerState={pomodoroTimerState} />
        </TabPanel>
        <TabPanel>
          <BlockedSites blockedSites={blockedSites} setBlockedSites={setBlockedSites} />
        </TabPanel>
      </Tabs>
    </div>
  )
}

export default App

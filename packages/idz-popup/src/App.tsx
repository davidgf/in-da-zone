import React, { useState, useEffect } from 'react'
// @ts-expect-error
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import BlockedSites from './BlockedSites'
import Timer from './Timer'
import 'bootstrap/dist/css/bootstrap.min.css'
import { TimerState, TimerStatus } from 'idz-shared'
import * as browser from 'webextension-polyfill'
import './App.css'

const defaultState: TimerState = {
  duration: 0,
  remaining: 0,
  status: TimerStatus.Stopped
}
function App (): JSX.Element {
  const [timerState, setTimerState] = useState<TimerState>(defaultState)

  useEffect(() => {
    browser.storage.local.get()
      .then(result => {
        const persistedTimerState = (result.timerState !== undefined)
          ? result.timerState
          : {}
        console.log('Persisting timer state:', persistedTimerState)
        setTimerState(persistedTimerState)
      })
      .catch(err => console.error('Error loading blocked sites', err))
  }, [])

  browser.runtime.onMessage.addListener(request => {
    console.log('Message listened from popup', request)
    setTimerState(request.timerState)
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
          <Timer timerState={timerState} />
        </TabPanel>
        <TabPanel>
          <BlockedSites />
        </TabPanel>
      </Tabs>
    </div>
  )
}

export default App

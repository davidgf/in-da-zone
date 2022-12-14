import React from 'react'
// @ts-expect-error
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import BlockedSites from './BlockedSites'
import Timer from './Timer'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

function App (): JSX.Element {
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
          <Timer />
        </TabPanel>
        <TabPanel>
          <BlockedSites />
        </TabPanel>
      </Tabs>
    </div>
  )
}

export default App

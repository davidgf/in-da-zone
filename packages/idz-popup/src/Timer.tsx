import React, { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import * as browser from 'webextension-polyfill'
import { TimerState, TimerStatus } from 'idz-shared'
import { Play, Stop } from 'react-bootstrap-icons'

const defaultState: TimerState = {
  duration: 0,
  remaining: 0,
  status: TimerStatus.Stopped
}

function TimerControlButton ({ currentState }: { currentState: TimerState }): JSX.Element {
  function startBlocking (): void {
    void browser.runtime.sendMessage({ startBlocking: true })
  }

  function stopBlocking (): void {
    void browser.runtime.sendMessage({ stopBlocking: true })
  }

  return currentState.status === TimerStatus.Active
    ? <Stop onClick={stopBlocking} size={30} />
    : <Play onClick={startBlocking} size={30} />
}

export default function Timer (): JSX.Element {
  const [timerState, setTimerState] = useState<TimerState>(defaultState)
  const [remainingMinutes, setRemainingMinutes] = useState<number>(0)
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0)

  useEffect(() => {
    if (timerState.duration > 0) {
      setRemainingMinutes(Math.floor(timerState.remaining / 60))
      setRemainingSeconds(timerState.remaining % 60)
    }
  })

  function padWithZero (number: number): string {
    return `00${number}`.slice(-2)
  }

  browser.runtime.onMessage.addListener(request => {
    setTimerState(request.timerState)
  })

  useEffect(() => {
    browser.storage.local.get()
      .then(result => {
        const persistedTimerState = (result.timerState !== undefined)
          ? result.timerState
          : {}
        setTimerState(persistedTimerState)
      })
      .catch(err => console.error('Error loading blocked sites', err))
  }, [])

  return (
    <Container>
      <Row className='justify-content-center mt-3'>
        <Col className='bg-secondary bg-opacity-10 col-10 pt-4 pb-4 border border-secondary rounded-1'>
          <h1 className='text-center'>{padWithZero(remainingMinutes)}:{padWithZero(remainingSeconds)}</h1>
        </Col>
      </Row>
      <Row className='justify-content-center mt-3'>
        <Col className='text-center'>
          <Button>
            <TimerControlButton currentState={timerState} />
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

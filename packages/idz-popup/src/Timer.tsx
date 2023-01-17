import React, { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Pagination from 'react-bootstrap/Pagination'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import * as browser from 'webextension-polyfill'
import { TimerState, TimerStatus, PomodoroTimerState } from 'idz-shared'
import { Play, Stop } from 'react-bootstrap-icons'

function TimerControlButton ({ currentState }: { currentState?: TimerState }): JSX.Element {
  function startBlocking (): void {
    void browser.runtime.sendMessage({ startBlocking: true })
  }

  function stopBlocking (): void {
    void browser.runtime.sendMessage({ stopBlocking: true })
  }

  return currentState?.status === TimerStatus.Active
    ? <Stop onClick={stopBlocking} size={30} />
    : <Play onClick={startBlocking} size={30} />
}

function CyclesPagination ({ pomodoroState }: { pomodoroState: PomodoroTimerState }): JSX.Element {
  return (
    <Pagination className='justify-content-center'>
      {
        Array(pomodoroState.cycles).fill(0).map((_, index) => {
          const className = pomodoroState.currentCycle <= index
            ? 'pagination__dot'
            : 'pagination__dot--active'
          return (<div key={`cycle-${index}`} className={className} />)
        })
      }
    </Pagination>
  )
}

export default function Timer ({ pomodoroTimerState }: { pomodoroTimerState: PomodoroTimerState }): JSX.Element {
  const [remainingMinutes, setRemainingMinutes] = useState<number>(0)
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0)

  useEffect(() => {
    const { timer } = pomodoroTimerState
    if (timer.duration > 0) {
      setRemainingMinutes(Math.floor(timer.remaining / 60))
      setRemainingSeconds(timer.remaining % 60)
    }
  })

  function padWithZero (number: number): string {
    return `00${number}`.slice(-2)
  }

  return (
    <Container>
      <Row className='justify-content-center mt-3'>
        <Col className='bg-light col-10 pt-4 pb-4 border border-secondary rounded-1'>
          <h1 className='text-center'>{padWithZero(remainingMinutes)}:{padWithZero(remainingSeconds)}</h1>
        </Col>
      </Row>
      <Row className='mt-3'>
        <CyclesPagination pomodoroState={pomodoroTimerState} />
      </Row>
      <Row className='justify-content-center mt-3'>
        <Col className='text-center'>
          <Button className='btn-primary'>
            <TimerControlButton currentState={pomodoroTimerState.timer} />
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

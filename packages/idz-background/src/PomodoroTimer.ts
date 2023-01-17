import { TypedEmitter } from 'tiny-typed-emitter'
import { PomodoroTimerState, PomodoroCycleStatus, PomodoroEvents, TimerEventTypes as TimerEvent, TimerState } from 'idz-shared'
import Timer from './Timer'

interface PomodoroTimerEvents {
  [PomodoroEvents.Started]: (state: PomodoroTimerState) => void
  [PomodoroEvents.Ticked]: (state: PomodoroTimerState) => void
  [PomodoroEvents.Finished]: (state: PomodoroTimerState) => void
  [PomodoroEvents.Stopped]: (state: PomodoroTimerState) => void
  [PomodoroEvents.CycleStarted]: (state: PomodoroTimerState) => void
  [PomodoroEvents.BreakStarted]: (state: PomodoroTimerState) => void
}

export default class PomodoroTimer extends TypedEmitter<PomodoroTimerEvents> {
  cycles: number
  duration: number
  breakDuration: number
  longBreakDuration: number
  currentCycle: number
  currentCycleStatus: PomodoroCycleStatus
  #timer: Timer

  constructor (
    { cycles = 4, duration = 1500, breakDuration = 300, longBreakDuration = 900 }:
    { cycles?: number, duration?: number, breakDuration?: number, longBreakDuration?: number } = {}
  ) {
    super()
    this.cycles = cycles
    this.duration = duration
    this.breakDuration = breakDuration
    this.longBreakDuration = longBreakDuration
    this.currentCycle = 0
    this.currentCycleStatus = PomodoroCycleStatus.Break
    this.#timer = new Timer()
  }

  get state (): PomodoroTimerState {
    return {
      cycles: this.cycles,
      currentCycle: this.currentCycle,
      currentCycleStatus: this.currentCycleStatus,
      timer: this.#timer.state
    }
  }

  start (): void {
    this.#timer?.removeAllListeners()
    this.#initTimer(this.duration)
    this.currentCycleStatus = PomodoroCycleStatus.Work
    this.currentCycle = 1
    this.#timer?.start()
    this.emit(PomodoroEvents.Started, this.state)
  }

  stop (): void {
    console.log('CLEARING')
    this.#clear()
    console.log('EMITTING')
    this.emit(PomodoroEvents.Stopped, this.state)
    console.log('EMITTED')
  }

  #initTimer (duration: number): void {
    this.#timer?.removeAllListeners()
    this.#timer = new Timer({ duration })
    this.#timer.on(TimerEvent.Ticked, data => this.#handleTimerEvent(TimerEvent.Ticked, data))
    this.#timer.on(TimerEvent.Finished, data => this.#handleTimerEvent(TimerEvent.Finished, data))
  }

  #handleTimerEvent (eventType: TimerEvent, timerState: TimerState): void {
    switch (eventType) {
      case TimerEvent.Ticked:
        this.#tick()
        break
      case TimerEvent.Finished:
        this.#nextTimer()
        break
    }
  }

  #tick (): void {
    this.emit(PomodoroEvents.Ticked, this.state)
  }

  #nextTimer (): void {
    switch (this.currentCycleStatus) {
      case PomodoroCycleStatus.Work:
        this.#startBreak()
        break
      case PomodoroCycleStatus.Break:
        this.#startNextCycle()
        break
    }
  }

  #startBreak (): void {
    const duration = this.#isLastCycle() ? this.longBreakDuration : this.breakDuration
    this.#initTimer(duration)
    this.currentCycleStatus = PomodoroCycleStatus.Break
    this.#timer?.start()
    this.emit(PomodoroEvents.BreakStarted, this.state)
  }

  #startNextCycle (): void {
    if (this.#isLastCycle()) return this.#finish()
    this.#initTimer(this.duration)
    this.currentCycleStatus = PomodoroCycleStatus.Work
    this.currentCycle++
    this.#timer?.start()
    this.emit(PomodoroEvents.CycleStarted, this.state)
  }

  #finish (): void {
    this.#timer?.removeAllListeners()
    this.emit(PomodoroEvents.Finished, this.state)
  }

  #isLastCycle (): boolean {
    return this.currentCycle === this.cycles
  }

  #clear (): void {
    this.#timer?.removeAllListeners()
    this.currentCycle = 0
    this.currentCycleStatus = PomodoroCycleStatus.Break
    this.#timer = new Timer()
  }
}

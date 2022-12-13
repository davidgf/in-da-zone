import { TypedEmitter } from 'tiny-typed-emitter'
import { TimerState, TimerStatus, TimerEventTypes as EventType } from 'idz-shared'

interface TimerEvents {
  [EventType.Started]: (state: TimerState) => void
  [EventType.Ticked]: (state: TimerState) => void
  [EventType.Paused]: (state: TimerState) => void
  [EventType.Resumed]: (state: TimerState) => void
  [EventType.Finished]: (state: TimerState) => void
  [EventType.Stopped]: (state: TimerState) => void
}

export default class Timer extends TypedEmitter<TimerEvents> {
  duration: number
  status: TimerStatus
  remaining: number
  #timerId: NodeJS.Timeout | null

  constructor ({ duration = 0, status = TimerStatus.Stopped }: { duration?: number, status?: TimerStatus } = {}) {
    super()
    this.duration = duration
    this.status = status
    this.remaining = 0
    this.#timerId = null
  }

  get state (): TimerState {
    return {
      duration: this.duration,
      status: this.status,
      remaining: this.remaining
    }
  }

  start (): void {
    if (this.status === TimerStatus.Stopped) {
      this.remaining = this.duration
      this.status = TimerStatus.Active
      this.#startTimer()
      this.emit(EventType.Started, this.state)
    }
  }

  tick (): void {
    if (this.status === TimerStatus.Active) {
      this.remaining = this.remaining - 1
      if (this.remaining <= 0) this.finish()
      else this.emit(EventType.Ticked, this.state)
    }
  }

  finish (): void {
    this.status = TimerStatus.Stopped
    this.#clearTimer()
    this.emit(EventType.Finished, this.state)
  }

  pause (): void {
    if (this.status === TimerStatus.Active) {
      this.status = TimerStatus.Paused
      this.#clearTimer()
      this.emit(EventType.Paused, this.state)
    }
  }

  resume (): void {
    if (this.status === TimerStatus.Paused) {
      this.status = TimerStatus.Active
      this.#startTimer()
      this.emit(EventType.Resumed, this.state)
    }
  }

  stop (): void {
    if (this.status === TimerStatus.Active || this.status === TimerStatus.Paused) {
      this.status = TimerStatus.Stopped
      this.#clearTimer()
      this.emit(EventType.Stopped, this.state)
    }
  }

  #startTimer (): void {
    if (this.#timerId === null) {
      this.#timerId = setInterval(() => this.tick(), 1000)
    }
  }

  #clearTimer (): void {
    if (this.#timerId != null) {
      clearInterval(this.#timerId)
      this.#timerId = null
    }
  }
}

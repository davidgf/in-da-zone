import { TypedEmitter } from 'tiny-typed-emitter'
import { TimerState, TimerStatus } from 'idz-shared'

interface TimerEvents {
  start: (state: TimerState) => void
  tick: (state: TimerState) => void
  pause: (state: TimerState) => void
  resume: (state: TimerState) => void
  finish: (state: TimerState) => void
  stop: (state: TimerState) => void
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
      this.emit('start', this.state)
    }
  }

  tick (): void {
    if (this.status === TimerStatus.Active) {
      this.remaining = this.remaining - 1
      if (this.remaining <= 0) this.finish()
      else this.emit('tick', this.state)
    }
  }

  finish (): void {
    this.status = TimerStatus.Stopped
    this.#clearTimer()
    this.emit('finish', this.state)
  }

  pause (): void {
    if (this.status === TimerStatus.Active) {
      this.status = TimerStatus.Paused
      this.#clearTimer()
      this.emit('pause', this.state)
    }
  }

  resume (): void {
    if (this.status === TimerStatus.Paused) {
      this.status = TimerStatus.Active
      this.#startTimer()
      this.emit('resume', this.state)
    }
  }

  stop (): void {
    if (this.status === TimerStatus.Active || this.status === TimerStatus.Paused) {
      this.status = TimerStatus.Stopped
      this.#clearTimer()
      this.emit('stop', this.state)
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

import { Audio, Euler, Vector3 } from 'three'

export function threeVectorSetFrom(from: Vector3, to: Vector3) {
  to.set(from.x, from.y, from.z)
}

export function threeEulerSetFrom(from: Euler, to: Euler) {
  to.set(from.x, from.y, from.z)
}

export function threeAudioPlay(sound: Audio, delay = 1500) {
  sound.play()
  setTimeout(() => {
    sound.stop()
  }, delay)
}

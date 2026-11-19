import { Effect, BlendFunction } from 'postprocessing'
import { Uniform } from 'three'
import { signalFragment } from './shaders.js'

export class SignalEffect extends Effect {
  constructor() {
    super('SignalEffect', signalFragment, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([['intensity', new Uniform(0)]]),
    })
  }

  set intensity(v) {
    this.uniforms.get('intensity').value = v
  }

  get intensity() {
    return this.uniforms.get('intensity').value
  }
}

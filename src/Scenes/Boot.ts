import { Scene } from 'phaser'

import { TextureKeys } from '../Utils/TextureKeys'

export class Boot extends Scene {
  constructor() {
    super('Boot')
  }

  preload() {
    this.load.setPath('assets')

    this.load.image(TextureKeys.MainLogo.name, TextureKeys.MainLogo.path)
    this.load.image(TextureKeys.GradientBackground.name, TextureKeys.GradientBackground.path)
  }

  create() {
    this.scene.start('Preloader')
  }
}

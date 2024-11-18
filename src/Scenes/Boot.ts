import { Scene } from 'phaser'

import { TextureKeys } from '../Utils/TextureKeys'

export class Boot extends Scene {
  constructor() {
    super('Boot')
  }

  preload() {
    this.load.setPath('assets')

    this.load.image(TextureKeys.mainLogo.name, TextureKeys.mainLogo.path)
    this.load.image(TextureKeys.gradientBackground.name, TextureKeys.gradientBackground.path)
  }

  create() {
    this.scene.start('Preloader')
  }
}

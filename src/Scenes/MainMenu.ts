import { Scene } from 'phaser'

import { TextureKeys } from '../Utils/TextureKeys'

export class MainMenu extends Scene {
  background: Phaser.GameObjects.Image
  logo: Phaser.GameObjects.Image
  title: Phaser.GameObjects.Text

  constructor() {
    super('MainMenu')
  }

  create() {
    this.background = this.add.image(512, 384, TextureKeys.gradientBackground.name)

    this.logo = this.add.image(512, 300, TextureKeys.mainLogo.name)

    this.title = this.add
      .text(512, 460, 'Main Menu', {
        fontFamily: 'Arial Black',
        fontSize: 38,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8,
        align: 'center'
      })
      .setOrigin(0.5)

    this.input.once('pointerdown', () => {
      this.scene.start('MainGame')
    })
  }
}

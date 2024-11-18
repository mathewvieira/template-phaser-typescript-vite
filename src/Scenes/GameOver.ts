import { Scene } from 'phaser'

import { TextureKeys } from '../Utils/TextureKeys'

export class GameOver extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera
  background: Phaser.GameObjects.Image
  gameOverText: Phaser.GameObjects.Text

  constructor() {
    super('GameOver')
  }

  create() {
    this.camera = this.cameras.main
    this.camera.setBackgroundColor(0xff0000)

    this.background = this.add.image(512, 384, TextureKeys.gradientBackground.name)
    this.background.setAlpha(0.5)

    this.gameOverText = this.add.text(512, 384, 'Game Over', {
      fontFamily: 'Arial Black',
      fontSize: 64,
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 8,
      align: 'center'
    })
    this.gameOverText.setOrigin(0.5)

    this.input.once('pointerdown', () => {
      this.scene.start('MainMenu')
    })
  }
}

import { Scene } from 'phaser'

import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin'
import Label from 'phaser3-rex-plugins/templates/ui/label/Label'

import { TextureKeys } from '../Utils/TextureKeys'
import { createButton, getGameSize } from '../Utils/Utils'
import { COLOR_BODY, COLOR_CLICK, COLOR_DARK, COLOR_LIGHT } from '../Utils/Consts'

export class Title extends Scene {
  background: Phaser.GameObjects.Image
  logo: Phaser.GameObjects.Image
  title: Phaser.GameObjects.Text

  buttons: UIPlugin.Buttons

  constructor() {
    super('Title')
  }

  create() {
    const gameSize = getGameSize()
    const gameSizeWidth = gameSize.width
    const gameSizeHeight = gameSize.height

    const halfGameWidth = gameSizeWidth / 2
    const halfGameHeight = gameSizeHeight / 2

    this.buttons = this.rexUI.add
      .buttons({
        x: halfGameWidth,
        y: halfGameHeight + 50,
        orientation: 'x',
        buttons: [createButton(this, 'NOVO JOGO'), createButton(this, 'CRÉDITOS')],
        space: { item: 15 }
      })
      .layout()
      .setDepth(99)
      .on('button.over', (button: Label) => {
        this.input.setDefaultCursor('pointer')
        const background = button.getElement('background') as Phaser.GameObjects.Rectangle | null
        if (background) background.setFillStyle(COLOR_DARK)
      })
      .on('button.out', (button: Label) => {
        this.input.setDefaultCursor('default')
        const background = button.getElement('background') as Phaser.GameObjects.Rectangle | null
        if (background) background.setFillStyle(COLOR_LIGHT)
      })
      .on('button.down', (button: Label, index: number) => {
        const background = button.getElement('background') as Phaser.GameObjects.Rectangle | null
        if (background) background.setFillStyle(COLOR_CLICK)
        this.input.setDefaultCursor('default')

        if (index === 0)
          setTimeout(() => {
            this.scene.start('Intro')
          }, 50)

        if (index === 1) {
          const dialog = this.rexUI.add
            .dialog({
              x: halfGameWidth,
              y: halfGameHeight,
              width: gameSizeWidth - 100,
              background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 6.5, COLOR_BODY),
              space: {
                title: 25,
                content: 25,
                action: 15,
                left: 10,
                right: 10,
                top: -15,
                bottom: 15
              },
              align: {
                actions: 'center'
              },
              expand: {
                content: false
              },

              title: this.rexUI.add.label({
                background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 6.5, 0x2f0873),
                text: this.add.text(0, 0, `Créditos`, {
                  fontSize: '24px',
                  resolution: 4
                }),
                space: {
                  left: 15,
                  right: 15,
                  top: 10,
                  bottom: 10
                },
                align: 'center'
              }),

              content: this.add.text(
                0,
                0,
                `Desenvolvedor: Mathew Vieira\n
                \nArtes, Visuais e Level Design: Mathew Vieira\n
                \nMúsica: Mathew Vieira\n
                \nGame Engine: Phaser (https://phaser.io/)
                \n`,
                {
                  color: '#000',
                  fontSize: '24px',
                  resolution: 4
                }
              ),

              actions: [
                this.rexUI.add.label({
                  background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 6.5, 0x2f0873),
                  text: this.add.text(0, 0, `Fechar`, {
                    fontSize: '24px'
                  }),
                  space: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10
                  }
                })
              ]
            })
            .layout()
            .popUp(1000)
            .setScrollFactor(0)
            .setDepth(999)
            .on('button.click', () => {
              dialog.scaleDownDestroy(100)
            })
        }
      })

    this.background = this.add.image(halfGameWidth, halfGameHeight, TextureKeys.gradientBackground.name)

    this.logo = this.add.image(halfGameWidth, halfGameHeight - 80, TextureKeys.mainLogo.name)

    this.add.particles(-100, 0, TextureKeys.wisteriaPetal.name, {
      x: { min: -100, max: gameSizeWidth },
      quantity: 1,
      lifespan: 4250,
      gravityY: 85,
      frequency: 1850,
      speedX: { min: 100, max: 125 },
      speedY: { min: 25, max: 85 },
      scale: { min: 1.2, max: 2.2 },
      rotate: { min: 10, max: 85 },
      alpha: { start: 1, end: 0 },
      angle: { min: -10, max: 10 },
      accelerationY: 20,
      advance: 2000
    })

    this.add.particles(-100, 0, TextureKeys.greenLeave.name, {
      x: { min: -100, max: gameSizeWidth },
      quantity: 1,
      lifespan: 4250,
      gravityY: 85,
      frequency: 2300,
      speedX: { min: 100, max: 125 },
      speedY: { min: 25, max: 85 },
      scale: { min: 1.1, max: 1.85 },
      rotate: { min: 10, max: 85 },
      alpha: { start: 1, end: 0 },
      angle: { min: -10, max: 10 },
      accelerationY: 20,
      advance: 2000
    })
  }

  update() {}
}

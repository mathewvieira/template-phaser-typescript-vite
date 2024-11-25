import Dialog from 'phaser3-rex-plugins/templates/ui/dialog/Dialog'
import { PhaserGame } from '../Game'
import { COLOR_BODY, COLOR_LIGHT, COLOR_TITLE } from './Consts'
import { GameSize } from './Types'

export const isDebugMode = (): boolean => {
  return PhaserGame.config.physics.arcade ? PhaserGame.config.physics.arcade.debug! : false
}

export const getGameSize = (): GameSize => {
  return { width: Number(PhaserGame.config.width), height: Number(PhaserGame.config.height) }
}

// Utilizar await na chamada do sleep e definir a função como async
export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

export const createButton = (scene: Phaser.Scene, text: string) => {
  const background = scene.rexUI.add.roundRectangle(0, 0, 0, 0, 6.5, COLOR_LIGHT).setStrokeStyle(2, 0x1a1a1a)
  background.setAlpha(0.5)

  return scene.rexUI.add.label({
    width: 100,
    height: 50,
    background: background,
    text: scene.add.text(0, 0, text, {
      color: '#ffffff',
      fontSize: 22,
      fontStyle: 'bold'
    }),
    space: {
      left: 155,
      right: 155
    },
    align: 'center'
  })
}

export const createDialog = (scene: Phaser.Scene, input: Phaser.Input.InputPlugin, title: string, content: string): Dialog => {
  const gameSize = getGameSize()
  const gameSizeWidth = gameSize.width
  const gameSizeHeight = gameSize.height

  const halfGameWidth = gameSizeWidth / 2
  const halfGameHeight = gameSizeHeight / 2

  const dialog = scene.rexUI.add
    .dialog({
      x: halfGameWidth,
      y: halfGameHeight,
      width: 250,
      background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 6.5, COLOR_BODY).setAlpha(0.9),
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

      title: scene.rexUI.add.label({
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 6.5, COLOR_TITLE),
        text: scene.add.text(0, 0, `${title}`, {
          fontSize: '14px',
          resolution: 2
        }),
        space: {
          left: 15,
          right: 15,
          top: 10,
          bottom: 10
        }
      }),

      content: scene.add.text(0, 0, `${content}`, {
        color: '#000',
        fontSize: '12px',
        resolution: 2
      }),

      actions: [
        scene.rexUI.add.label({
          background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 6.5, COLOR_LIGHT),
          text: scene.add.text(0, 0, 'Fechar (C)', {
            fontSize: '14px'
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
      input.keyboard?.removeListener('keydown-C')
    })

  input.keyboard?.on('keydown-C', () => {
    if (dialog) {
      dialog.scaleDownDestroy(100)
      input.keyboard?.removeListener('keydown-C')
    }
  })

  return dialog
}

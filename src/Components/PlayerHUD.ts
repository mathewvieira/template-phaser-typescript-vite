import Dialog from 'phaser3-rex-plugins/templates/ui/dialog/Dialog'

import { TextureKeys } from '../Utils/TextureKeys'
import { createDialog, getGameSize } from '../Utils/Utils'

export class PlayerHUD {
  private collectibleRBar: Phaser.GameObjects.Sprite

  constructor(public scene: Phaser.Scene, public input: Phaser.Input.InputPlugin) {
    this.collectibleRBar = this.scene.add
      .sprite(getGameSize().width / 2 - 200, getGameSize().height / 2, TextureKeys.collectibleRBar.name)
      .setScrollFactor(0)
      .setDepth(100)

    this.scene.add
      .sprite(getGameSize().width / 2 + 135, getGameSize().height / 2 + 120, TextureKeys.controlsSchema.name)
      .setScrollFactor(0)
      .setDepth(100)
  }

  create() {}

  updateHUDInfo = () => {}

  addCollectiblePinToBar = (remainingToAdd: number): boolean => {
    if (remainingToAdd <= 0 || remainingToAdd > 7) {
      console.error(`Invalid remainingToAdd value: ${remainingToAdd}. Must be between 1 and 7.`)
      return false
    }

    const positionY = 57 - (remainingToAdd - 1) * 19

    this.scene.add
      .sprite(getGameSize().width / 2 - 200, getGameSize().height / 2 + positionY, TextureKeys.collectibleRPin.name)
      .setScrollFactor(0)
      .setDepth(100)

    return true
  }

  showDialogCollectedR = (remainingToAdd: number): Dialog => {
    let title: string = ''
    let content: string = ''

    switch (remainingToAdd) {
      case 7:
        title = '1 - Repensar (7 Rs)'
        content = 'Avalie seus hábitos de consumo e\nconsidere escolhas mais sustentáveis.'
        break

      case 6:
        title = '2 - Recusar (7 Rs)'
        content = 'Diga não a produtos que prejudicam o\nmeio ambiente ou que você não necessita.'
        break

      case 5:
        title = '3 - Reduzir (7 Rs)'
        content = 'Diminua o uso de recursos e a geração\nde resíduos no seu dia a dia.'
        break

      case 4:
        title = '4 - Reutilizar (7 Rs)'
        content = 'Dê uma nova vida a objetos, utilizando-os\nde maneiras diferentes.'
        break

      case 3:
        title = '5 - Reparar (7 Rs)'
        content = 'Conserte itens quebrados em vez de\ndescartá-los, prolongando sua utilidade.'
        break

      case 2:
        title = '6 - Reciclar (7 Rs)'
        content = 'Separe e encaminhe materiais recicláveis\npara a coleta seletiva adequada.'
        break

      case 1:
        title = '7 - Reintegrar (7 Rs)'
        content = 'Incorpore materiais reciclados ou orgânicos\nde volta ao ciclo produtivo ou à natureza.'
        break
    }

    return createDialog(this.scene, this.input, title, content)
  }

  destroy = () => {
    this.collectibleRBar.destroy()
  }
}

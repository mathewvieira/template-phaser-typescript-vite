import { CustomKeyboard, KeyCode } from '../Utils/Types'

export class InputHandler {
  private keyboard: CustomKeyboard

  constructor(public input: Phaser.Input.InputPlugin) {
    if (!this.input.keyboard) return

    this.keyboard = {
      [KeyCode.LEFT]: this.input.keyboard.addKey(KeyCode.LEFT),
      [KeyCode.RIGHT]: this.input.keyboard.addKey(KeyCode.RIGHT),
      [KeyCode.UP]: this.input.keyboard.addKey(KeyCode.UP),
      [KeyCode.DOWN]: this.input.keyboard.addKey(KeyCode.DOWN),
      [KeyCode.SPACE]: this.input.keyboard.addKey(KeyCode.SPACE),
      [KeyCode.SHIFT]: this.input.keyboard.addKey(KeyCode.SHIFT),
      [KeyCode.W]: this.input.keyboard.addKey(KeyCode.W),
      [KeyCode.A]: this.input.keyboard.addKey(KeyCode.A),
      [KeyCode.S]: this.input.keyboard.addKey(KeyCode.S),
      [KeyCode.D]: this.input.keyboard.addKey(KeyCode.D)
    }
  }

  handleKeyboard(): CustomKeyboard {
    return this.keyboard
  }

  getKey(key: KeyCode): Phaser.Input.Keyboard.Key {
    return this.keyboard[key]
  }

  public isKeyDown(key: KeyCode): boolean
  public isKeyDown(keys: Array<KeyCode>): boolean
  public isKeyDown(key: KeyCode | Array<KeyCode>): boolean {
    if (Array.isArray(key)) {
      return key.some(keyCode => this.keyboard[keyCode].isDown)
    } else {
      return this.keyboard[key].isDown
    }
  }

  public isJustDown(key: KeyCode): boolean
  public isJustDown(keys: Array<KeyCode>): boolean
  public isJustDown(key: KeyCode | Array<KeyCode>): boolean {
    if (Array.isArray(key)) {
      return key.some(keyCode => Phaser.Input.Keyboard.JustDown(this.keyboard[keyCode]))
    } else {
      return Phaser.Input.Keyboard.JustDown(this.keyboard[key])
    }
  }
}

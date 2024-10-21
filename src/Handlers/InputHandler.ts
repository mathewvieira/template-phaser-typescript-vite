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

  // handleKeyboard(): IKeyPressed {
  //   const { LEFT, RIGHT, UP, DOWN, SPACE, W, A, S, D } = KeyCode

  //   const isLeftDown = this.isKeyDown([LEFT, A])
  //   const isRightDown = this.isKeyDown([RIGHT, D])
  //   const isUpDown = this.isKeyDown([UP, W, SPACE])
  //   const isDownDown = this.isKeyDown([DOWN, S])

  //   const isLeftJustDown = this.isJustDown([LEFT, A])
  //   const isRightJustDown = this.isJustDown([RIGHT, D])
  //   const isUpJustDown = this.isJustDown([UP, W, SPACE])
  //   const isDownJustDown = this.isJustDown([DOWN, S])

  //   return {
  //     isLeftDown,
  //     isRightDown,
  //     isUpDown,
  //     isDownDown,
  //     isLeftJustDown,
  //     isRightJustDown,
  //     isUpJustDown,
  //     isDownJustDown
  //   }
  // }

  public isKeyDown(input: KeyCode): boolean
  public isKeyDown(inputs: Array<KeyCode>): boolean
  public isKeyDown(input: KeyCode | Array<KeyCode>): boolean {
    if (Array.isArray(input)) {
      return input.some((keyCode) => this.keyboard[keyCode].isDown)
    } else {
      return this.keyboard[input].isDown
    }
  }

  public isJustDown(input: KeyCode): boolean
  public isJustDown(inputs: Array<KeyCode>): boolean
  public isJustDown(input: KeyCode | Array<KeyCode>): boolean {
    if (Array.isArray(input)) {
      return input.some((keyCode) => Phaser.Input.Keyboard.JustDown(this.keyboard[keyCode]))
    } else {
      return Phaser.Input.Keyboard.JustDown(this.keyboard[input])
    }
  }
}

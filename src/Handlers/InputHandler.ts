export class InputHandler {
  private keyboard: Keyboard

  constructor(public input: Phaser.Input.InputPlugin) {
    if (!this.input.keyboard) return

    const cursor = this.input.keyboard.createCursorKeys()
    const keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    const keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    const keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    const keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)

    this.keyboard = { cursor, keyW, keyA, keyS, keyD }
  }

  handleKeyboard(): KeyPressed {
    const { cursor, keyW, keyA, /* KeyS, */ keyD } = this.keyboard

    const isLeftDown = cursor.left.isDown || keyA.isDown
    const isRightDown = cursor.right.isDown || keyD.isDown

    const isJumpJustDown =
      Phaser.Input.Keyboard.JustDown(cursor.up) ||
      Phaser.Input.Keyboard.JustDown(cursor.space) ||
      Phaser.Input.Keyboard.JustDown(keyW)

    // const didHoldDown = KeyS.isDown

    return { isLeftDown, isRightDown, isJumpJustDown }
  }
}

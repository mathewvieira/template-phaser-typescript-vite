type Keyboard = {
  cursor: Phaser.Types.Input.Keyboard.CursorKeys
  keyW: Phaser.Input.Keyboard.Key
  keyS: Phaser.Input.Keyboard.Key
  keyA: Phaser.Input.Keyboard.Key
  keyD: Phaser.Input.Keyboard.Key
}

interface KeyPressed {
  isLeftDown: boolean
  isRightDown: boolean
  isJumpJustDown: boolean
}

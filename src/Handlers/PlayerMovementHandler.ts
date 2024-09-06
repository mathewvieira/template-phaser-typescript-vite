const PLAYER_JUMP_HEIGHT = -220
const PLAYER_MOVEMENT_SPEED = 210

export class PlayerMovementHandler {
  private jumpCount = 0

  constructor(public player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {}

  handlePlayerMovement(keyPressed: KeyPressed) {
    this.player.setVelocityX(
      keyPressed.isLeftDown ? -PLAYER_MOVEMENT_SPEED : keyPressed.isRightDown ? PLAYER_MOVEMENT_SPEED : 0
    )
  }

  handlePlayerSpriteDirection(keyPressed: KeyPressed) {
    if (keyPressed.isLeftDown) this.player.flipX = true
    if (keyPressed.isRightDown) this.player.flipX = false
  }

  handlePlayerJump(keyPressed: KeyPressed) {
    if (!this.player.body) return

    let canJump = false
    let canDoubleJump = false

    if (keyPressed.isJumpJustDown) {
      canJump = true

      if (this.player.body.blocked.down) {
        this.player.setVelocityY(PLAYER_JUMP_HEIGHT)
        canDoubleJump = true
        canJump = true
        this.jumpCount++
      } else if (canDoubleJump) {
        this.player.setVelocityY(PLAYER_JUMP_HEIGHT)
        canDoubleJump = false
        canJump = false
        this.jumpCount++
      } else if (canJump && !this.player.body.blocked.down && !canDoubleJump && this.jumpCount < 1) {
        this.player.setVelocityY(PLAYER_JUMP_HEIGHT)
        canDoubleJump = false
        canJump = false
        this.jumpCount++
      }

      if (this.player.body.blocked.left || this.player.body.blocked.right) this.player.setVelocityY(PLAYER_JUMP_HEIGHT)
    }

    if (this.player.body.blocked.down) this.jumpCount = 0
  }
}

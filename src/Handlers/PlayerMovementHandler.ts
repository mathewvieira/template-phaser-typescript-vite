const PLAYER_JUMP_HEIGHT = -220
const PLAYER_MOVEMENT_SPEED = 210

export class PlayerMovementHandler {
  private jumpCount = 0

  constructor(public player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {}

  handlePlayerMovement(keyPressed: IKeyPressed) {
    this.player.setVelocityX(
      keyPressed.isLeftDown ? -PLAYER_MOVEMENT_SPEED : keyPressed.isRightDown ? PLAYER_MOVEMENT_SPEED : 0
    )
  }

  handlePlayerSpriteDirection(keyPressed: IKeyPressed) {
    if (keyPressed.isLeftDown) this.player.flipX = true
    if (keyPressed.isRightDown) this.player.flipX = false
  }

  handlePlayerAnimation(keyPressed: IKeyPressed) {
    const {} = keyPressed

    if (this.player.texture.key == 'rocketmouse') {
      let velocityX = Math.abs(this.player.body.velocity.x)
      if (velocityX > 0) {
        this.player.play('run', true)
      }
      if (velocityX === 0 && this.player.body.blocked.down) {
        this.player.play('idle', true)
      }
      if (this.player.body.velocity.y < 0) {
        this.player.play('flying', true)
      }
      if (this.player.body.velocity.y > 0) {
        this.player.play('fall', true)
      }
    }
  }

  handlePlayerJump(keyPressed: IKeyPressed) {
    if (!this.player.body) return

    let canJump = false
    let canDoubleJump = false

    if (keyPressed.isUpJustDown) {
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

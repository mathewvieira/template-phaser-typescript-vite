import { TextureKeys } from '../Utils/TextureKeys'

interface IPlayerConfigs {
  jumpHeight: number
  movementSpeed: number
  gravityY: number
}

export class PlayerMovementHandler {
  private jumpCount = 0
  private keyPressed: IKeyPressed

  constructor(
    public player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    public configs: IPlayerConfigs
  ) {
    this.player.body.setGravityY(this.configs.gravityY)
  }

  update(keyPressed: IKeyPressed) {
    this.keyPressed = keyPressed

    this.handlePlayerMovement()
    this.handlePlayerJump()
    this.handleJumpCountReset()
    this.handlePlayerSpriteDirection()
    this.handlePlayerAnimation()
    this.handleVerticalJump()
  }

  handlePlayerMovement() {
    this.player.setVelocityX(
      this.keyPressed.isLeftDown
        ? -this.configs.movementSpeed
        : this.keyPressed.isRightDown
        ? this.configs.movementSpeed
        : 0
    )

    if (this.player.texture.key === TextureKeys.RocketMouse.name) {
      if (this.player.body.blocked.down && !this.keyPressed.isRightDown && !this.keyPressed.isLeftDown) {
        this.player.setVelocityX(-this.configs.movementSpeed * 0.3)
      }
    }
  }

  handlePlayerSpriteDirection() {
    if (this.player.texture.key === TextureKeys.RocketMouse.name) {
      if (this.keyPressed.isRightDown && this.player.angle < 10) {
        this.player.angle += 1
        return
      }

      if (this.keyPressed.isLeftDown && (this.player.angle === 0 || this.player.angle > -15)) {
        this.player.angle -= 1
        return
      }

      this.player.angle <= 0 ? (this.player.angle += 1) : (this.player.angle -= 1)
      return
    }

    if (this.keyPressed.isRightDown) this.player.flipX = false
    if (this.keyPressed.isLeftDown) this.player.flipX = true
  }

  handlePlayerAnimation() {
    if (this.player.texture.key === TextureKeys.RocketMouse.name) {
      if (!this.player.body.blocked.down) {
        this.player.body.velocity.y < 0 ? this.player.play('flying', true) : this.player.play('fall', true)
        return
      }

      this.player.play('run', true)
      return
    }
  }

  handlePlayerJump() {
    if (!this.keyPressed.isUpJustDown) return

    if (this.player.body.blocked.down) {
      this.player.setVelocityY(-this.configs.jumpHeight)
      this.jumpCount++
      return
    }

    if (!this.player.body.blocked.down && this.jumpCount < 1) {
      this.player.setVelocityY(-this.configs.jumpHeight)
      this.jumpCount++
      return
    }
  }

  handleVerticalJump() {
    if (this.keyPressed.isUpJustDown && (this.player.body.blocked.left || this.player.body.blocked.right))
      this.player.setVelocityY(-this.configs.jumpHeight)
  }

  handleJumpCountReset() {
    if (this.player.body.blocked.down) this.jumpCount = 0
  }
}

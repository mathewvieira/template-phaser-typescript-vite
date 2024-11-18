import { TextureKeys } from '../Utils/TextureKeys'
import { KeyCode } from '../Utils/Types'
import { InputHandler } from './InputHandler'

interface IPlayerConfigs {
  jumpHeight: number
  movementSpeed: number
  gravityY: number
}

export class PlayerMovementHandler {
  private jumpCount = 0
  private input: InputHandler

  constructor(public player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, public configs: IPlayerConfigs) {
    this.player.body.setGravityY(this.configs.gravityY)
  }

  update(input: InputHandler) {
    this.input = input

    this.handleMovement()
    this.handleJump()

    this.handleSpriteDirection()
    this.handleAnimation()

    this.handleJumpCountReset()
  }

  handleMovement() {
    this.player.setVelocityX(
      this.input.isKeyDown([KeyCode.LEFT, KeyCode.A])
        ? -this.configs.movementSpeed
        : this.input.isKeyDown([KeyCode.RIGHT, KeyCode.D])
        ? this.configs.movementSpeed
        : 0
    )

    if (this.player.texture.key === TextureKeys.rocketMouse.name) {
      if (this.player.body.blocked.down && !this.input.isKeyDown([KeyCode.LEFT, KeyCode.A]) && !this.input.isKeyDown([KeyCode.RIGHT, KeyCode.D])) {
        this.player.setVelocityX(-this.configs.movementSpeed * 0.3)
      }
    }
  }

  handleSpriteDirection() {
    if (this.player.texture.key === TextureKeys.rocketMouse.name) {
      if (this.input.isKeyDown([KeyCode.RIGHT, KeyCode.D]) && this.player.angle < 10) {
        this.player.angle += 1
        return
      }

      if (this.input.isKeyDown([KeyCode.LEFT, KeyCode.A]) && this.player.angle > -15) {
        this.player.angle -= 1
        return
      }

      if (!this.input.isKeyDown([KeyCode.RIGHT, KeyCode.D]) && this.player.angle < 0) {
        this.player.angle += 1
        return
      }

      if (!this.input.isKeyDown([KeyCode.LEFT, KeyCode.A]) && this.player.angle > 0) {
        this.player.angle -= 1
        return
      }
    }

    if (this.input.isKeyDown([KeyCode.RIGHT, KeyCode.D])) this.player.flipX = false
    if (this.input.isKeyDown([KeyCode.LEFT, KeyCode.A])) this.player.flipX = true
  }

  handleAnimation() {
    if (this.player.texture.key === TextureKeys.rocketMouse.name) {
      if (!this.player.body.blocked.down) {
        if (this.player.body.velocity.y < 0) {
          this.player.play('flying', true)
          return
        }

        this.player.play('fall', true)
        return
      }

      this.player.play('run', true)
      return
    }
  }

  handleJump() {
    if (!this.input.isJustDown([KeyCode.UP, KeyCode.W, KeyCode.SPACE])) return

    if (this.player.body.blocked.down || this.isWallJump()) {
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

  handleJumpCountReset() {
    if (this.player.body.blocked.down) this.jumpCount = 0
  }

  isWallJump() {
    return this.player.body.blocked.left || this.player.body.blocked.right
  }
}

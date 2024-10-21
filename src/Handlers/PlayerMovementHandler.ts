import { TextureKeys } from '../Utils/TextureKeys'
import { CustomKeyboard, KeyCode } from '../Utils/Types'
import { InputHandler } from './InputHandler'

interface IPlayerConfigs {
  jumpHeight: number
  movementSpeed: number
  gravityY: number
}

export class PlayerMovementHandler {
  private jumpCount = 0
  private input: InputHandler
  private keyboard: CustomKeyboard

  constructor(
    public player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    public configs: IPlayerConfigs
  ) {
    this.player.body.setGravityY(this.configs.gravityY)
  }

  update(input: InputHandler) {
    this.input = input
    this.keyboard = this.input.handleKeyboard()

    this.handlePlayerMovement()
    this.handlePlayerJump()
    this.handleJumpCountReset()
    this.handlePlayerSpriteDirection()
    this.handlePlayerAnimation()
    this.handleVerticalJump()
  }

  handlePlayerMovement() {
    this.player.setVelocityX(
      this.input.isKeyDown([KeyCode.LEFT, KeyCode.A])
        ? -this.configs.movementSpeed
        : this.input.isKeyDown([KeyCode.RIGHT, KeyCode.D])
        ? this.configs.movementSpeed
        : 0
    )

    if (this.player.texture.key === TextureKeys.RocketMouse.name) {
      if (
        this.player.body.blocked.down &&
        !this.input.isKeyDown([KeyCode.LEFT, KeyCode.A]) &&
        !this.input.isKeyDown([KeyCode.RIGHT, KeyCode.D])
      ) {
        this.player.setVelocityX(-this.configs.movementSpeed * 0.3)
      }
    }
  }

  handlePlayerSpriteDirection() {
    if (this.player.texture.key === TextureKeys.RocketMouse.name) {
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
    if (!this.input.isJustDown([KeyCode.UP, KeyCode.W, KeyCode.SPACE])) return

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
    if (
      this.input.isKeyDown([KeyCode.UP, KeyCode.W, KeyCode.SPACE]) &&
      (this.player.body.blocked.left || this.player.body.blocked.right)
    )
      this.player.setVelocityY(-this.configs.jumpHeight)
  }

  handleJumpCountReset() {
    if (this.player.body.blocked.down) this.jumpCount = 0
  }
}

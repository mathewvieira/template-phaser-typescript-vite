// import { TextureKeys } from '../Utils/TextureKeys'

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

  private isMovingLeft = false
  private isMovingRight = false
  private isMovingUp = false
  private isMovingDown = false

  private isJumping = false

  private isPreventingMovement = false

  constructor(public player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, public configs: IPlayerConfigs) {
    this.player.body.setGravityY(this.configs.gravityY)
  }

  update(input: InputHandler) {
    this.input = input

    this.isMovingLeft = this.input.isKeyDown([KeyCode.LEFT, KeyCode.A])
    this.isMovingRight = this.input.isKeyDown([KeyCode.RIGHT, KeyCode.D])
    this.isMovingUp = this.input.isKeyDown([KeyCode.UP, KeyCode.W])
    this.isMovingDown = this.input.isKeyDown([KeyCode.DOWN, KeyCode.S])

    this.isJumping = this.input.isJustDown([KeyCode.UP, KeyCode.W, KeyCode.SPACE])

    if (!this.isPreventingMovement) {
      this.handleMovement()
      this.handleJump()
      this.handleClimb()

      this.handleSpriteDirection()
      this.handleAnimation()

      this.handleJumpCountReset()
    }
  }

  preventMovement(value: boolean) {
    this.isPreventingMovement = value
    this.player.setVelocityX(0)
    this.update(this.input)
  }

  handleMovement() {
    if (!this.isMovingLeft && !this.isMovingRight) this.player.setVelocityX(0)
    if (this.isMovingLeft) this.player.setVelocityX(-this.configs.movementSpeed)
    if (this.isMovingRight) this.player.setVelocityX(this.configs.movementSpeed)

    // if (this.player.texture.key === TextureKeys.rocketMouse.name) {
    //   if (this.player.body.blocked.down && !this.input.isKeyDown([KeyCode.LEFT, KeyCode.A]) && !this.input.isKeyDown([KeyCode.RIGHT, KeyCode.D])) {
    //     this.player.setVelocityX(-this.configs.movementSpeed * 0.3)
    //   }
    // }
  }

  handleSpriteDirection() {
    // if (this.player.texture.key === TextureKeys.rocketMouse.name) {
    //   if (this.input.isKeyDown([KeyCode.RIGHT, KeyCode.D]) && this.player.angle < 10) {
    //     this.player.angle += 1
    //     return
    //   }
    //   if (this.input.isKeyDown([KeyCode.LEFT, KeyCode.A]) && this.player.angle > -15) {
    //     this.player.angle -= 1
    //     return
    //   }
    //   if (!this.input.isKeyDown([KeyCode.RIGHT, KeyCode.D]) && this.player.angle < 0) {
    //     this.player.angle += 1
    //     return
    //   }
    //   if (!this.input.isKeyDown([KeyCode.LEFT, KeyCode.A]) && this.player.angle > 0) {
    //     this.player.angle -= 1
    //     return
    //   }
    // }

    if (this.isMovingLeft) this.player.flipX = true
    if (this.isMovingRight) this.player.flipX = false
  }

  handleAnimation() {
    // if (this.player.texture.key === TextureKeys.rocketMouse.name) {
    //   if (!this.player.body.blocked.down) {
    //     if (this.player.body.velocity.y < 0) {
    //       this.player.play('flying', true)
    //       return
    //     }
    //     this.player.play('fall', true)
    //     return
    //   }
    //   this.player.play('run', true)
    //   return
    // }

    this.player.play('idle', true)
  }

  handleJump() {
    if (!this.isJumping) return

    if (this.player.body.blocked.down || this.canWallJump()) {
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

  handleClimb() {
    if (!this.player.getData('canClimb')) {
      this.player.setGravityY(this.configs.gravityY)
      return
    }

    this.player.setGravityY(-300)
    this.player.setVelocityY(0)

    if (this.isMovingUp) {
      this.player.setVelocityY(-150)
    }

    if (this.isMovingDown) {
      this.player.setVelocityY(150)
    }
  }

  handleJumpCountReset() {
    if (this.player.body.blocked.down) this.jumpCount = 0
  }

  canWallJump() {
    return this.player.body.blocked.left || this.player.body.blocked.right
  }
}

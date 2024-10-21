import { Scene } from 'phaser'

import { IS_DEBUG_MODE } from '../Utils/Consts'

import { TextureKeys } from '../Utils/TextureKeys'
import { InputHandler } from '../Handlers/InputHandler'
import { PlayerMovementHandler } from '../Handlers/PlayerMovementHandler'

export class InfiniteScroller extends Scene {
  private readonly PLAYER_JUMP_HEIGHT = 600
  private readonly PLAYER_MOVEMENT_SPEED = 450
  private readonly PLAYER_GRAVITY_Y = 500

  private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
  private inputHandler: InputHandler
  private playerMovementHandler: PlayerMovementHandler
  private background: Phaser.GameObjects.TileSprite

  private debugInfo: Phaser.GameObjects.Text

  constructor() {
    super('InfiniteScroller')
  }

  create() {
    const gameWidth = Number(this.game.config.width)
    const gameHeight = Number(this.game.config.height)

    this.background = this.add.tileSprite(0, 0, gameWidth, gameHeight, TextureKeys.HouseBackground.name)
    this.background.setOrigin(0, 0)
    this.background.displayHeight = gameHeight + 155

    this.cameras.main.setBounds(0, 0, gameWidth, gameHeight)
    this.cameras.main.centerOn(0, 0)

    this.player = this.physics.add.sprite(gameWidth / 2, gameHeight / 2, TextureKeys.RocketMouse.name)
    this.player.setCollideWorldBounds(true)
    this.player.setGravity(0, 300)
    this.player.setScale(1.25)
    this.player.setBodySize(125, 0, true)

    this.player.setInteractive()
    this.player.on('pointerover', () => {
      console.log('pointerover')
    })

    this.physics.world.setBounds(0, 0, gameWidth, gameHeight - 50)

    this.inputHandler = new InputHandler(this.input)
    this.playerMovementHandler = new PlayerMovementHandler(this.player, {
      jumpHeight: this.PLAYER_JUMP_HEIGHT,
      movementSpeed: this.PLAYER_MOVEMENT_SPEED,
      gravityY: this.PLAYER_GRAVITY_Y
    })

    if (IS_DEBUG_MODE) {
      this.debugInfo = this.add.text(-20, 10, '', {
        font: '12px Courier',
        color: '#555555'
      })
      this.debugInfo.setScrollFactor(0)
    }

    this.input.once('pointerdown', () => {
      this.scene.start('MainGame')
    })
  }

  update() {
    this.playerMovementHandler.update(this.inputHandler)

    this.background.tilePositionX += 1.1

    if (IS_DEBUG_MODE) {
      this.debugInfo.setText([
        '               velocity.x: ' + this.player.body.velocity.x,
        '               velocity.y: ' + this.player.body.velocity.y,
        '                gravity.x: ' + this.player.body.gravity.x,
        '                gravity.y: ' + this.player.body.gravity.y,
        '                    speed: ' + this.player.body.speed,
        '                        x: ' + this.player.body.x,
        '                        y: ' + this.player.body.y,
        '',
        '                 camera.x: ' + this.cameras.main.x,
        '                 camera.y: ' + this.cameras.main.y,
        '      camera.displayWidth: ' + this.cameras.main.displayWidth,
        '     camera.displayHeight: ' + this.cameras.main.displayHeight,
        '        camera.midPoint.x: ' + this.cameras.main.midPoint.x,
        '        camera.midPoint.y: ' + this.cameras.main.midPoint.y,
        '           camera.centerX: ' + this.cameras.main.centerX, //Centro X da Câmera
        '           camera.centerY: ' + this.cameras.main.centerY, //Centro Y da Câmera
        '',
        '        game.config.width: ' + this.game.config.width,
        '       game.config.height: ' + this.game.config.height,
        '',
        '                world.fps: ' + this.physics.world.fps,
        '       world.bounds.width: ' + this.physics.world.bounds.width,
        '      world.bounds.height: ' + this.physics.world.bounds.height,
        '         world.bounds.top: ' + this.physics.world.bounds.top,
        '      world.bounds.bottom: ' + this.physics.world.bounds.bottom,
        '        world.bounds.left: ' + this.physics.world.bounds.left,
        '       world.bounds.right: ' + this.physics.world.bounds.right,
        '           world.bounds.x: ' + this.physics.world.bounds.x,
        '           world.bounds.y: ' + this.physics.world.bounds.y,
        '     world.bounds.centerX: ' + this.physics.world.bounds.centerX, //Centro X do Mundo
        '     world.bounds.centerY: ' + this.physics.world.bounds.centerY //Centro Y do Mundo
      ])
    }
  }
}

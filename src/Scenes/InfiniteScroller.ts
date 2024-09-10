import { Scene } from 'phaser'

const IS_DEBUG_MODE = true

export class InfiniteScroller extends Scene {
  private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
  private background: Phaser.GameObjects.TileSprite

  private debugInfo: Phaser.GameObjects.Text

  constructor() {
    super('InfiniteScroller')
  }

  create() {
    const gameWidth = Number(this.game.config.width)
    const gameHeight = Number(this.game.config.height)

    this.background = this.add.tileSprite(0, 0, gameWidth, gameHeight, 'bg-house')
    this.background.setOrigin(0, 0)
    this.background.displayHeight = gameHeight + 155

    this.cameras.main.setBounds(0, 0, gameWidth, gameHeight)
    this.cameras.main.centerOn(0, 0)

    this.player = this.physics.add.sprite(gameWidth / 2, gameHeight / 2, 'rocketmouse')

    this.physics.world.setBounds(0, 0, gameWidth, gameHeight)
    this.physics.world.gravity.y = 300
    this.physics.add.existing(this.player)

    if (IS_DEBUG_MODE) {
      this.debugInfo = this.add.text(-20, 10, '', {
        font: '12px Courier',
        color: '#555555',
      })
      this.debugInfo.setScrollFactor(0)
    }

    this.input.once('pointerdown', () => {
      this.scene.start('MainGame')
    })
  }

  update() {
    this.background.tilePositionX += 2

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
        '     world.bounds.centerY: ' + this.physics.world.bounds.centerY, //Centro Y do Mundo
      ])
    }
  }
}

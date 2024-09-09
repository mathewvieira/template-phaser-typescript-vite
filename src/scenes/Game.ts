import { Scene } from 'phaser'
import { InputHandler } from '../Handlers/InputHandler'
import { PlayerMovementHandler } from '../Handlers/PlayerMovementHandler'

const IS_DEBUG_MODE = true

export class Game extends Scene {
  private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
  private terrainMap: Phaser.Tilemaps.Tilemap
  private terrainTileset: Phaser.Tilemaps.Tileset | ''
  private baseLayer: Phaser.Tilemaps.TilemapLayer | null
  private inputHandler: InputHandler
  private playerMovementHandler: PlayerMovementHandler
  private background: Phaser.GameObjects.Image
  private mountains: Phaser.GameObjects.TileSprite

  private debugMap: Phaser.GameObjects.Graphics
  private debugInfo: Phaser.GameObjects.Text

  constructor() {
    super('Game')
  }

  create() {
    this.background = this.add.image(0, 0, 'backgroundTest').setOrigin(0, -0.2)
    this.background.displayWidth = Number(this.game.config.width)
    this.background.displayHeight = Number(this.game.config.height) - 165
    this.background.setScrollFactor(0.05)

    this.mountains = this.add.tileSprite(-512, 580, 2368, 320, 'mountains')
    this.mountains.setOrigin(0, 0)
    // this.mountains.setScrollFactor(0.5)

    this.terrainMap = this.make.tilemap({ key: 'terrain-map' })
    this.terrainTileset = this.terrainMap.addTilesetImage('terrain-tiles') ?? ''
    this.baseLayer = this.terrainMap.createLayer('base', this.terrainTileset)

    // this.player = this.physics.add.sprite(0, 0, 'rocketmouse')
    this.player = this.physics.add.sprite(0, 0, 'coward')

    if (!this.baseLayer) return

    this.inputHandler = new InputHandler(this.input)
    this.playerMovementHandler = new PlayerMovementHandler(this.player)

    this.baseLayer.setCollisionByProperty({ collides: true })

    this.player.setOrigin(0)
    this.player.setGravity(0, 300)
    this.player.setCollideWorldBounds(true)
    this.player.postFX.addShine(1, 0.5, 5)
    this.player.setMaxVelocity(500, 500)

    if (this.player.texture.key == 'rocketmouse') {
      this.player.setScale(0.35)
      this.player.setBodySize(this.player.width - 25, this.player.height - 12.5, false)
      this.player.setOffset(4.5, 0)
    }

    let widthPadding = Number(this.game.config.width) * 0.5
    let heightPadding = Number(this.game.config.height) * 0.5
    let tileWidth = this.terrainMap.tileWidth
    let terrainWidth = this.terrainMap.width * tileWidth
    let terrainHeight = this.terrainMap.height * tileWidth

    this.cameras.main.setBounds(
      -widthPadding,
      -heightPadding,
      terrainWidth + widthPadding * 2,
      terrainHeight + heightPadding - 100
    )
    this.cameras.main.setZoom(2)
    this.cameras.main.startFollow(this.player, true)
    this.cameras.main.centerOn(0, 0)

    this.physics.world.setBounds(
      -widthPadding,
      -heightPadding,
      terrainWidth + widthPadding * 2,
      terrainHeight + heightPadding
    )
    this.physics.world.gravity.y = 300
    this.physics.add.existing(this.player)
    this.physics.add.collider(this.player, this.baseLayer)

    Phaser.Display.Align.In.BottomLeft(this.player, this.baseLayer, 0, -210)

    if (IS_DEBUG_MODE) {
      this.debugMap = this.add.graphics().setAlpha(0.7)
      this.terrainMap.renderDebug(this.debugMap)
      this.player.setDebug(true, true, 555)

      this.debugInfo = this.add.text(240, 200, '', { font: '10px Courier', color: '#00ff00' })
      this.debugInfo.setScrollFactor(0)
    }

    this.input.once('pointerdown', () => {
      this.scene.start('GameOver')
    })
  }

  update() {
    const keyPressed = this.inputHandler.handleKeyboard()

    this.playerMovementHandler.handlePlayerMovement(keyPressed)
    this.playerMovementHandler.handlePlayerJump(keyPressed)
    this.playerMovementHandler.handlePlayerSpriteDirection(keyPressed)
    this.playerMovementHandler.handlePlayerAnimation(keyPressed)

    // this.mountains.tilePositionX -= 1

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

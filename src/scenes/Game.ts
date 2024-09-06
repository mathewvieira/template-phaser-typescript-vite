import { Scene } from 'phaser'
import { InputHandler } from '../Handlers/InputHandler'
import { PlayerMovementHandler } from '../Handlers/PlayerMovementHandler'

export class Game extends Scene {
  private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
  private terrainMap: Phaser.Tilemaps.Tilemap
  private terrainTileset: Phaser.Tilemaps.Tileset | ''
  private baseLayer: Phaser.Tilemaps.TilemapLayer | null
  private inputHandler: InputHandler
  private playerMovementHandler: PlayerMovementHandler

  constructor() {
    super('Game')
  }

  create() {
    this.anims.create({
      key: 'dead',
      frames: this.anims.generateFrameNames('rocketmouse', {
        prefix: 'rocketmouse_dead',
        start: 1,
        end: 2,
        zeroPad: 2
      }),
      frameRate: 8
    })

    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNames('rocketmouse', {
        prefix: 'rocketmouse_run',
        start: 1,
        end: 4,
        zeroPad: 2
      }),
      frameRate: 8,
      repeat: -1
    })

    this.terrainMap = this.make.tilemap({ key: 'terrain-map' })
    this.terrainTileset = this.terrainMap.addTilesetImage('terrain-tiles') ?? ''
    this.baseLayer = this.terrainMap.createLayer('base', this.terrainTileset)
    this.player = this.physics.add.sprite(350, 250, 'rocketmouse')

    if (!this.baseLayer) return

    this.inputHandler = new InputHandler(this.input)
    this.playerMovementHandler = new PlayerMovementHandler(this.player)

    this.baseLayer.setCollisionByProperty({ collides: true })

    this.player.setOrigin(0)
    this.player.setScale(0.35)
    this.player.setGravity(0, 300)
    this.player.setCollideWorldBounds(true)
    this.player.setBodySize(this.player.width - 15, this.player.width - 14.5, false)
    this.player.postFX.addShine(1, 0.5, 5)
    this.player.play('run')

    // this.player.setOffset(-100, -10)
    // this.player.setBounce(0.2)
    // this.player.setInteractive(this.input.makePixelPerfect())

    const widthPadding = Number(this.game.config.width) * 0.5
    const heightPadding = Number(this.game.config.height) * 0.5
    const tileWidth = this.terrainMap.tileWidth
    const terrainWidth = this.terrainMap.width * tileWidth
    const terrainHeight = this.terrainMap.height * tileWidth

    this.cameras.main.setBounds(
      -widthPadding,
      -heightPadding,
      terrainWidth + widthPadding * 2,
      terrainHeight + heightPadding - 100
    )
    this.cameras.main.startFollow(this.player, true)
    this.cameras.main.setZoom(2)

    this.physics.world.setBounds(
      -widthPadding,
      -heightPadding,
      terrainWidth + widthPadding * 2,
      terrainHeight + heightPadding
    )
    this.physics.world.gravity.y = 300

    this.physics.add.existing(this.player)
    this.physics.add.collider(this.player, this.baseLayer)

    // TODO:
    // this.controls = {
    //   ...this.cursors,
    //   ...this.keyboard
    // }

    // DEBUG:
    // const debugGraphics = this.add.graphics().setAlpha(0.7)
    // this.terrainMap.renderDebug(debugGraphics)
    // this.player.setDebug(true, true, 555)
    // console.log(this.player.toJSON())
    // console.log(this.player.toggleData(''))
    // this.input.keyboard.enabled = false
    // this.input.keyboard.disableGlobalCapture()

    // Trocar: this.player.body.blocked.down  Por: this.player.body.onFloor()  Caso necessário
  }

  update() {
    const keyPressed = this.inputHandler.handleKeyboard()

    this.playerMovementHandler.handlePlayerMovement({ ...keyPressed })
    this.playerMovementHandler.handlePlayerSpriteDirection({ ...keyPressed })
    this.playerMovementHandler.handlePlayerJump({ ...keyPressed })
  }
}

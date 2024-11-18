import { Scene } from 'phaser'

import { isDebugMode } from '../Utils/Utils'
import { TextureKeys } from '../Utils/TextureKeys'
import { InputHandler } from '../Handlers/InputHandler'
import { PlayerMovementHandler } from '../Handlers/PlayerMovementHandler'
import { KeyCode } from '../Utils/Types'

export class MainGame extends Scene {
  private readonly PLAYER_JUMP_HEIGHT = 220
  private readonly PLAYER_MOVEMENT_SPEED = 210
  private readonly PLAYER_GRAVITY_Y = 300

  private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
  private terrainMap: Phaser.Tilemaps.Tilemap
  private terrainTileset: Phaser.Tilemaps.Tileset
  private terrainLayer: Phaser.Tilemaps.TilemapLayer
  private inputHandler: InputHandler
  private playerMovementHandler: PlayerMovementHandler
  private background: Phaser.GameObjects.Image
  private mountains: Phaser.GameObjects.TileSprite

  private debugMap: Phaser.GameObjects.Graphics
  private debugInfo: Phaser.GameObjects.Text

  constructor() {
    super('MainGame')
  }

  create() {
    // ADD: Commit Linter - https://prettier.io/docs/en/precommit.html

    const gameWidth = Number(this.game.config.width)
    const gameHeight = Number(this.game.config.height)

    this.background = this.add
      .image(0, 0, TextureKeys.moonBackground.name)
      .setOrigin(0, -0.3105)
      .setDisplaySize(gameWidth - 100, gameHeight - 165)
      .setScrollFactor(0.05)
      .setScale(2.2)

    // this.terrainMap = this.make.tilemap({ key: TextureKeys.TerrainTiles.map })
    // this.terrainTileset = this.terrainMap.addTilesetImage(TextureKeys.TerrainTiles.name)!

    this.terrainMap = this.make.tilemap({ key: TextureKeys.terrainGothicTiles.map })
    this.terrainTileset = this.terrainMap.addTilesetImage(TextureKeys.terrainGothicTiles.name)!

    this.terrainLayer = this.terrainMap.createLayer('terrain', this.terrainTileset)!.setCollisionByProperty({ collides: true })

    this.player = this.physics.add
      .sprite(2688, 1600, TextureKeys.cowardDog.name)
      // .setOrigin(0)
      .setGravity(0, 300)
      .setCollideWorldBounds(true)
      .setMaxVelocity(500, 500)
      .setBodySize(26, 30, true)
    // .setFriction(1, 1)

    this.player.postFX.addShine(1, 0.5, 5)

    this.inputHandler = new InputHandler(this.input)
    this.playerMovementHandler = new PlayerMovementHandler(this.player, {
      jumpHeight: this.PLAYER_JUMP_HEIGHT,
      movementSpeed: this.PLAYER_MOVEMENT_SPEED,
      gravityY: this.PLAYER_GRAVITY_Y
    })

    const rightPadding = 600
    const leftPadding = -rightPadding
    const downPadding = 400
    const topPadding = -downPadding
    const widthPadding = rightPadding * 2
    const heightPadding = downPadding * 2

    const terrainWidth = this.terrainLayer.width
    const terrainHeight = this.terrainLayer.height

    const worldWidth = terrainWidth + widthPadding
    const worldHeight = terrainHeight + heightPadding

    this.cameras.main
      .setBounds(leftPadding, topPadding, worldWidth, worldHeight - 100)
      .setZoom(2.2)
      .startFollow(this.player, true)

    this.physics.world.setBounds(leftPadding, topPadding, worldWidth, worldHeight)

    this.physics.add.collider(this.player, this.terrainLayer)

    this.physics.add.overlap(
      this.player,
      this.terrainLayer,
      this.checkClimbableTile as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    )

    this.mountains = this.add.tileSprite(leftPadding, topPadding + 820, worldWidth, worldHeight, TextureKeys.mountainsBackground.name)
    this.mountains.setOrigin(0, 0)
    this.mountains.setScrollFactor(0.1)

    this.background.depth = 0
    this.mountains.depth = 1
    this.terrainLayer.depth = 2
    this.player.depth = 3

    if (isDebugMode()) {
      this.debugMap = this.add.graphics().setAlpha(0.7)
      this.terrainMap.renderDebug(this.debugMap)
      this.player.setDebug(true, true, 555)

      this.debugInfo = this.add.text(260, 210, '', {
        font: '8px Courier',
        color: '#00ff00'
      })
      this.debugInfo.setScrollFactor(0)

      this.debugMap.depth = this.player.depth + 1
      this.debugInfo.depth = this.player.depth + 2
    }

    this.input.once('pointerdown', () => {
      this.scene.start('GameOver')
    })
  }

  update() {
    const canClimb = this.player.getData('canClimb')
    // const climbableWorldPosition = this.player.getData('climbableWorldPosition')
    this.playerMovementHandler.update(this.inputHandler)

    if (canClimb) {
      this.player.setGravityY(-300)
      this.player.setVelocityY(0)

      if (this.inputHandler.isKeyDown([KeyCode.UP, KeyCode.W])) {
        this.player.setVelocityY(-150)
      }

      if (this.inputHandler.isKeyDown([KeyCode.DOWN, KeyCode.S])) {
        this.player.setVelocityY(150)
      }
    } else {
      this.player.setGravityY(this.PLAYER_GRAVITY_Y)
    }

    if (isDebugMode()) {
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

  public checkClimbableTile = () => {
    const playerBounds = this.player.getBounds()

    // Tiles na área de colisão do jogador
    const tiles = this.terrainLayer.getTilesWithinWorldXY(
      playerBounds.x + playerBounds.width / 2,
      playerBounds.y,
      0,
      playerBounds.height,
      undefined,
      this.cameras.main
    )

    const canClimb = tiles.some(tile => tile.properties.climbable)

    this.player.setData('canClimb', canClimb)
  }
}

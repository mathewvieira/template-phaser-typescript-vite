import { Scene } from 'phaser'

import { IS_DEBUG_MODE } from '../Utils/Consts'

import { TextureKeys } from '../Utils/TextureKeys'
import { InputHandler } from '../Handlers/InputHandler'
import { PlayerMovementHandler } from '../Handlers/PlayerMovementHandler'

export class MainGame extends Scene {
  private readonly PLAYER_JUMP_HEIGHT = 220
  private readonly PLAYER_MOVEMENT_SPEED = 210
  private readonly PLAYER_GRAVITY_Y = 300

  private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
  private terrainMap: Phaser.Tilemaps.Tilemap
  private terrainTileset: Phaser.Tilemaps.Tileset
  private collisionLayer: Phaser.Tilemaps.TilemapLayer
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
    // TODO: Estudar GDD
    //
    // ADD: Commit Linter - https://prettier.io/docs/en/precommit.html

    const gameWidth = Number(this.game.config.width)
    const gameHeight = Number(this.game.config.height)

    this.background = this.add
      .image(0, 0, TextureKeys.MoonBackground.name)
      .setOrigin(0, -0.3105)
      .setDisplaySize(gameWidth - 100, gameHeight - 165)
      .setScrollFactor(0.05)
      .setScale(2.2)

    // this.terrainMap = this.make.tilemap({ key: TextureKeys.TerrainTiles.map })
    // this.terrainTileset = this.terrainMap.addTilesetImage(TextureKeys.TerrainTiles.name)!

    this.terrainMap = this.make.tilemap({ key: TextureKeys.TerrainGothicTiles.map })
    this.terrainTileset = this.terrainMap.addTilesetImage(TextureKeys.TerrainGothicTiles.name)!

    this.collisionLayer = this.terrainMap // Must have the same layerID of the JSON's first layer name
      .createLayer('collision-layer', this.terrainTileset)!
      .setCollisionByProperty({ collides: true })

    this.player = this.physics.add
      .sprite(gameWidth / 2, gameHeight / 2, TextureKeys.CowardDog.name)
      .setOrigin(0)
      .setGravity(0, 300)
      .setCollideWorldBounds(true)
      .setMaxVelocity(500, 500)

    this.player.postFX.addShine(1, 0.5, 5)

    this.inputHandler = new InputHandler(this.input)
    this.playerMovementHandler = new PlayerMovementHandler(this.player, {
      jumpHeight: this.PLAYER_JUMP_HEIGHT,
      movementSpeed: this.PLAYER_MOVEMENT_SPEED,
      gravityY: this.PLAYER_GRAVITY_Y
    })

    const widthPadding = gameWidth / 2
    const heightPadding = gameHeight / 2
    const terrainWidth = this.terrainMap.width * this.terrainMap.tileWidth
    const terrainHeight = this.terrainMap.height * this.terrainMap.tileWidth
    const worldWidth = terrainWidth + widthPadding * 2
    const worldHeight = terrainHeight + heightPadding

    this.cameras.main
      .setBounds(-widthPadding, -heightPadding, worldWidth, worldHeight - 100)
      .setZoom(2.2)
      .startFollow(this.player, true)

    this.physics.world.setBounds(-widthPadding, -heightPadding, worldWidth, worldHeight)
    this.physics.add.collider(this.player, this.collisionLayer)

    this.mountains = this.add.tileSprite(
      -widthPadding,
      heightPadding,
      worldWidth,
      heightPadding,
      TextureKeys.MountainsBackground.name
    )
    this.mountains.setOrigin(0, 0)
    this.mountains.setScrollFactor(0.1)

    this.background.depth = 0
    this.mountains.depth = 1
    this.collisionLayer.depth = 2
    this.player.depth = 3

    if (IS_DEBUG_MODE) {
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
    this.playerMovementHandler.update(this.inputHandler.handleKeyboard())

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

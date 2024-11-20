import { isDebugMode } from '../Utils/Utils'
import { TextureKeys } from '../Utils/TextureKeys'
import { InputHandler } from '../Handlers/InputHandler'
import { PlayerMovementHandler } from '../Handlers/PlayerMovementHandler'
import { DebugComponent } from '../Components/DebugComponent'

export class MainGame extends Phaser.Scene {
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

  private debugComponent: DebugComponent

  private loop: Phaser.Core.TimeStep

  constructor() {
    super('MainGame')
  }

  create() {
    const gameWidth = Number(this.game.config.width)
    const gameHeight = Number(this.game.config.height)

    this.background = this.add
      .image(0, 0, TextureKeys.moonBackground.name)
      .setOrigin(0, -0.3105)
      .setDisplaySize(gameWidth - 100, gameHeight - 165)
      .setScrollFactor(0.05)
      .setScale(2.2)

    this.terrainMap = this.make.tilemap({ key: TextureKeys.terrainGothicTiles.map })
    this.terrainTileset = this.terrainMap.addTilesetImage(TextureKeys.terrainGothicTiles.name)!

    this.terrainLayer = this.terrainMap.createLayer('terrain', this.terrainTileset)!
    this.terrainLayer.setCollisionByProperty({ collides: true })

    this.player = this.physics.add
      .sprite(3523, 1330, TextureKeys.cowardDog.name)
      .setGravity(0, this.PLAYER_GRAVITY_Y)
      .setCollideWorldBounds(true)
      .setMaxVelocity(500, 500)
      .setBodySize(26, 32, true)

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

    this.background.setDepth(0)
    this.mountains.setDepth(1)
    this.terrainLayer.setDepth(2)
    this.player.setDepth(99)

    if (isDebugMode()) {
      this.debugComponent = new DebugComponent(this)
      this.debugComponent.renderTilemapDebug(this.terrainMap)
      this.player.setDebug(true, true, 555)
    }

    this.input.once('pointerdown', () => {
      this.scene.start('GameOver')
    })

    this.loop = this.game.loop

    this.createMovingPlatformsFromTiles()
  }

  update() {
    this.checkFallTile()

    this.playerMovementHandler.update(this.inputHandler)

    if (isDebugMode() && this.debugComponent) {
      this.debugComponent.updateDebugInfo({ player: this.player, camera: this.cameras.main, game: this.game, world: this.physics.world })
    }
  }

  checkClimbableTile = (player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, tile: Phaser.Tilemaps.Tile) => {
    if (tile && tile.properties.climbable) {
      const playerBounds = player.getBounds()

      const tiles = this.terrainLayer.getTilesWithinWorldXY(
        playerBounds.x + playerBounds.width / 2,
        playerBounds.y,
        0,
        playerBounds.height,
        undefined,
        this.cameras.main
      )

      const canClimb = tiles.some(tile => tile.properties.climbable)

      player.setData('canClimb', canClimb)
    }
  }

  createMovingPlatformsFromTiles() {
    this.terrainLayer.forEachTile(tile => {
      if (!tile.properties.movesVertically && !tile.properties.movesHorizontally) return

      const tileWorldXY = this.terrainLayer.tileToWorldXY(tile.x, tile.y)

      const maxMove = tile.properties.maxMove || 100

      let path: Phaser.Curves.Path | undefined = undefined

      if (tile.properties.movesVertically) {
        path = new Phaser.Curves.Path(tileWorldXY.x, tileWorldXY.y).lineTo(tileWorldXY.x, tileWorldXY.y + maxMove)
      }

      if (tile.properties.movesHorizontally) {
        path = new Phaser.Curves.Path(tileWorldXY.x, tileWorldXY.y).lineTo(tileWorldXY.x + maxMove, tileWorldXY.y)
      }

      if (!path) return

      const platform = this.add.follower(path, tileWorldXY.x, tileWorldXY.y, TextureKeys.platformTile.name)
      platform.setDepth(3).setAlpha(0.5)

      this.physics.add.existing(platform)

      const platformBody = platform.body as Phaser.Physics.Arcade.Body
      platformBody.setAllowGravity(false).setImmovable(true).setFriction(1)

      this.physics.add.collider(
        this.player,
        platformBody,
        this.checkCollisionBetweenPlayerAndPlatform as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
        () => {
          return this.isTopCollisionBetweenPlayerAndPlatform(this.player, platformBody)
        },
        this
      )

      this.terrainLayer.removeTileAt(tile.x, tile.y)

      platform.startFollow({
        duration: 3000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        onUpdate: () => {
          platformBody.velocity.copy(platform.pathDelta).scale(1000 / this.loop.delta)
        }
      })
    })
  }

  checkCollisionBetweenPlayerAndPlatform = (player: Phaser.Types.Physics.Arcade.GameObjectWithBody, platform: Phaser.Physics.Arcade.Body) => {
    if (player.body.blocked.down && platform.touching.up) {
      player.setData('isOnPlatform', true)
      player.setData('currentPlatform', platform)
    }
  }

  isTopCollisionBetweenPlayerAndPlatform = (player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, platform: Phaser.Physics.Arcade.Body) => {
    return platform.y > player.body.y
  }

  checkFallTile = () => {
    if (this.player.body.blocked.down) {
      const playerBounds = this.player.getBounds()

      const playerBottomY = playerBounds.bottom

      const playerXLeft = playerBounds.x
      const tileBelowLeft = this.terrainLayer.getTileAtWorldXY(playerXLeft, playerBottomY)

      const playerXRight = playerBounds.x + this.player.width - 5
      const tileBelowRight = this.terrainLayer.getTileAtWorldXY(playerXRight, playerBottomY)

      if (tileBelowLeft && tileBelowLeft.properties.falls) {
        this.fallTile(tileBelowLeft)
      }

      if (tileBelowRight && tileBelowRight.properties.falls) {
        this.fallTile(tileBelowRight)
      }
    }
  }

  fallTile = (tile: Phaser.Tilemaps.Tile) => {
    this.time.addEvent({
      delay: 350,
      callback: () => {
        tile.setCollision(false)

        this.tweens.add({
          targets: tile,
          alpha: 0,
          duration: 350,
          onComplete: () => {
            tile.alpha = 0

            this.time.addEvent({
              delay: 2000,
              callback: () => {
                tile.setAlpha(1)
                tile.setCollision(true)
              }
            })
          }
        })
      }
    })
  }
}

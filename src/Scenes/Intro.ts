import { createDialog, getGameSize, isDebugMode } from '../Utils/Utils'
import { TextureKeys } from '../Utils/TextureKeys'
import { InputHandler } from '../Handlers/InputHandler'
import { PlayerMovementHandler } from '../Handlers/PlayerMovementHandler'
import { DebugComponent } from '../Components/DebugComponent'
import { FlyingCollectible } from '../Components/FlyingCollectible'
import { PlayerHUD } from '../Components/PlayerHUD'

export class Intro extends Phaser.Scene {
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

  private playerHUD: PlayerHUD

  private debugComponent: DebugComponent

  private loop: Phaser.Core.TimeStep

  private collectibleRs: Phaser.Physics.Arcade.Group

  constructor() {
    super('Intro')
  }

  create() {
    const gameSize = getGameSize()
    const gameSizeWidth = gameSize.width
    const gameSizeHeight = gameSize.height

    this.background = this.add
      .image(0, 0, TextureKeys.moonBackground.name)
      .setOrigin(0, -0.3105)
      .setDisplaySize(gameSizeWidth - 100, gameSizeHeight - 165)
      .setScrollFactor(0.05)
      .setScale(2.3)

    this.terrainMap = this.make.tilemap({ key: TextureKeys.terrainTiles.map })
    this.terrainTileset = this.terrainMap.addTilesetImage(TextureKeys.terrainTiles.name)!

    this.terrainLayer = this.terrainMap.createLayer('terrain', this.terrainTileset)!
    this.terrainLayer.setCollisionByProperty({ collides: true })

    this.playerHUD = new PlayerHUD(this, this.input)

    const playerSpawn = { x: 112.5, y: 1744.5 }

    this.player = this.physics.add
      .sprite(playerSpawn.x, playerSpawn.y, TextureKeys.annieVeron.name)
      .setGravity(0, this.PLAYER_GRAVITY_Y)
      .setCollideWorldBounds(true)
      .setMaxVelocity(500, 500)
      .setBodySize(26, 32, true)

    this.player.postFX.addShine(1, 0.5, 5)

    this.collectibleRs = this.physics.add.group({ allowGravity: false, immovable: true })
    this.createFlyingCollectibleFromTiles()

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
      .setBounds(leftPadding, topPadding, worldWidth, worldHeight - 437)
      .setZoom(2.2)
      .startFollow(this.player, true)

    this.physics.world.setBounds(leftPadding, topPadding, worldWidth, worldHeight - 312)
    this.player.body.onWorldBounds = true

    this.physics.add.collider(this.player, this.terrainLayer)

    this.physics.add.overlap(
      this.player,
      this.terrainLayer,
      this.checkClimbableTile as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    )
    this.physics.add.overlap(this.player, this.collectibleRs, this.collectR as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this)

    this.physics.world.on('worldbounds', (body: Phaser.Physics.Arcade.Body, top: boolean, down: boolean, left: boolean, right: boolean) => {
      if (body.gameObject === this.player && (top || down || left || right)) {
        this.player.setPosition(playerSpawn.x, playerSpawn.y)
      }
    })

    this.mountains = this.add.tileSprite(leftPadding, topPadding + 835, worldWidth, worldHeight, TextureKeys.mountainsBackground.name)
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

  collectR = (_player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, collectibleR: FlyingCollectible) => {
    collectibleR.destroy()

    if (this.playerHUD.addCollectiblePinToBar(this.collectibleRs.getLength() + 1)) {
      this.playerMovementHandler.preventMovement(true)
      const dialog = this.playerHUD.showDialogCollectedR(this.collectibleRs.getLength() + 1)

      dialog.on('destroy', () => {
        if (this.collectibleRs.getLength() === 0) {
          setTimeout(() => {
            this.playerMovementHandler.preventMovement(true)

            const userCompletedTheGameDialog = createDialog(
              this,
              this.input,
              `Parabéns!`,
              `Você coletou todos os 7 Rs da Sustentabilidade.
              \nNo contexto atual das mudanças climáticas, essas
              \nsão algumas das ações que podem ser realizadas
              \npara preservar o nosso planeta.\n

              \nEspero que tenha se divertido nesta breve aventura.
              \nObrigado por jogar!!\n`
            )

            userCompletedTheGameDialog.on('destroy', () => {
              this.scene.start('Title')
            })
          }, 2000)
        }

        this.playerMovementHandler.preventMovement(false)
      })
    }
  }

  checkClimbableTile = (player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, tile: Phaser.Tilemaps.Tile) => {
    let canClimb = false

    if (tile && tile.properties.climbable) {
      const playerBounds = player.getBounds()

      const tiles = this.terrainLayer.getTilesWithinWorldXY(
        playerBounds.x + player.width / 2,
        playerBounds.y,
        0,
        playerBounds.height,
        undefined,
        this.cameras.main
      )

      canClimb = tiles.some(tile => tile.properties.climbable)
    }

    player.setData('canClimb', canClimb)
  }

  createFlyingCollectibleFromTiles() {
    this.terrainLayer.forEachTile(tile => {
      if (!tile.properties.isCollectible) return

      const tileWorldXY = this.terrainLayer.tileToWorldXY(tile.x, tile.y)

      this.collectibleRs.add(new FlyingCollectible(this, tileWorldXY.x + tile.width / 2, tileWorldXY.y + tile.width, 2.5, 2.5, 0.007), true)

      this.terrainLayer.removeTileAt(tile.x, tile.y)
    })
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

      const platform = this.add.follower(
        path,
        tileWorldXY.x,
        tileWorldXY.y,
        tile.properties.movesVertically ? TextureKeys.whitePlatformTile.name : TextureKeys.bluePlatformTile.name
      )

      platform.setDepth(3)

      this.physics.add.existing(platform)

      const platformBody = platform.body as Phaser.Physics.Arcade.Body
      platformBody.setAllowGravity(false).setImmovable(true).setFriction(1)

      this.physics.add.collider(
        this.player,
        platformBody,
        this.checkCollisionBetweenPlayerAndPlatform as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback
        // () => {
        //   return this.isTopCollisionBetweenPlayerAndPlatform(this.player, platformBody)
        // },
        // this
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

  // isTopCollisionBetweenPlayerAndPlatform = (player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, platform: Phaser.Physics.Arcade.Body) => {
  //   // return platform.y > player.body.y
  // }

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

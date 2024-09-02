import { Scene } from 'phaser'

export class Game extends Scene {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys
  private player: Phaser.Physics.Arcade.Image

  constructor() {
    super('Game')
  }

  create() {
    const terrainMap = this.make.tilemap({ key: 'terrain-map' })
    const terrainTileset = terrainMap.addTilesetImage('terrain-tiles') ?? ''

    const base = terrainMap.createLayer('base', terrainTileset)
    if (!base) return
    base.setCollisionByProperty({ collides: true })

    // const debugGraphics = this.add.graphics().setAlpha(0.7)
    // terrainMap.renderDebug(debugGraphics)

    this.player = this.physics.add.sprite(500, 500, 'asher')
    this.player.setOrigin(0)
    this.player.setInteractive(this.input.makePixelPerfect())
    this.player.setBounce(0.2)
    this.player.setCollideWorldBounds(true)
    this.player.setGravity(0, 6000)
    this.player.setScale(1.25)

    this.player.postFX.addShine(1, 0.5, 5)

    this.cameras.main.setBounds(0, 0, 1024, 2048)
    this.cameras.main.startFollow(this.player, true)
    this.cameras.main.setZoom(4)

    this.physics.add.collider(this.player, base)

    if (this.input.keyboard) this.cursors = this.input.keyboard.createCursorKeys()
  }

  update() {
    this.player.setVelocity(0)

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-600)
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(600)
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-800)
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(600)
    }
  }
}

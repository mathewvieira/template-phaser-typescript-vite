import { TextureKeys } from '../Utils/TextureKeys'

export class FlyingCollectible extends Phaser.Physics.Arcade.Sprite {
  private path: Phaser.Curves.Ellipse
  private pathIndex: number
  private pathSpeed: number
  private pathVector: Phaser.Math.Vector2

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, speed: number) {
    super(scene, x, y, TextureKeys.collectibleR.name)

    scene.physics.add.existing(this)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setCircle(12, 3.5, 3.5)

    this.path = new Phaser.Curves.Ellipse(x, y, width, height)
    this.pathIndex = 0
    this.pathSpeed = speed
    this.pathVector = new Phaser.Math.Vector2()
    this.path.getPoint(0, this.pathVector)

    this.postFX.addShine(1, 0.5, 6)
    this.setDepth(4).setPosition(this.pathVector.x, this.pathVector.y).disableInteractive(true)
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta)
    this.path.getPoint(this.pathIndex, this.pathVector)
    this.setPosition(this.pathVector.x, this.pathVector.y)
    this.pathIndex = Phaser.Math.Wrap(this.pathIndex + this.pathSpeed, 0, 1)
  }
}

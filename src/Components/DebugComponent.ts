import { IDebugObjects } from '../Utils/Types'

export class DebugComponent {
  private scene: Phaser.Scene

  private debugMap: Phaser.GameObjects.Graphics
  private debugInfo: Phaser.GameObjects.Text

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.debugMap = this.scene.add.graphics().setAlpha(0.7)
    this.debugInfo = this.scene.add.text(250, 210, '', {
      font: '8px Courier',
      color: '#00ff00',
      resolution: 2
    })

    this.debugInfo.setScrollFactor(0)

    this.debugMap.setDepth(99999)
    this.debugInfo.setDepth(this.debugMap.depth + 1)
  }

  renderTilemapDebug(tilemap: Phaser.Tilemaps.Tilemap) {
    tilemap.renderDebug(this.debugMap)
  }

  updateDebugInfo(debugObjects: IDebugObjects) {
    const player = debugObjects.player
    const camera = debugObjects.camera
    const game = debugObjects.game
    const world = debugObjects.world

    this.debugInfo.setText([
      `
        - player.body
        velocity.x    : ${player.body.velocity.x}
        velocity.y    : ${player.body.velocity.y}
        gravity.x     : ${player.body.gravity.x}
        gravity.y     : ${player.body.gravity.y}
        speed         : ${player.body.speed}
        maxSpeed      : ${player.body.maxSpeed}
        maxVelocity.x : ${player.body.maxVelocity.x}
        maxVelocity.y : ${player.body.maxVelocity.y}
        x             : ${player.body.x}
        y             : ${player.body.y}


        - cameras.main
        midPoint.x    : ${camera.midPoint.x}
        midPoint.y    : ${camera.midPoint.y}
        displayWidth  : ${camera.displayWidth}
        displayHeight : ${camera.displayHeight}
        centerX       : ${camera.centerX}
        centerY       : ${camera.centerY}
        x             : ${camera.x}
        y             : ${camera.y}


        - game.config
        width  : ${game.config.width}
        height : ${game.config.height}


        - world.bounds
        fps     : ${world.fps}
        width   : ${world.bounds.width}
        height  : ${world.bounds.height}
        top     : ${world.bounds.top}
        bottom  : ${world.bounds.bottom}
        left    : ${world.bounds.left}
        right   : ${world.bounds.right}
        x       : ${world.bounds.x}
        y       : ${world.bounds.y}
        centerX : ${world.bounds.centerX}
        centerY : ${world.bounds.centerY}
      `
    ])
  }

  destroy() {
    this.debugMap.destroy()
    this.debugInfo.destroy()
  }
}

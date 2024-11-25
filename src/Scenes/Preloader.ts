import { Scene } from 'phaser'

import { TextureKeys } from '../Utils/TextureKeys'

export class Preloader extends Scene {
  constructor() {
    super('Preloader')
  }

  init() {
    this.add.image(512, 384, TextureKeys.gradientBackground.name)

    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff)

    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff)

    this.load.on('progress', (progress: number) => {
      bar.width = 4 + 460 * progress
    })
  }

  preload() {
    this.load.setPath('assets')

    this.load.image(TextureKeys.terrainTiles.name, TextureKeys.terrainTiles.path)
    this.load.tilemapTiledJSON(TextureKeys.terrainTiles.map, TextureKeys.terrainTiles.map)

    this.load.image(TextureKeys.terrainGothicTiles.name, TextureKeys.terrainGothicTiles.path)
    this.load.tilemapTiledJSON(TextureKeys.terrainGothicTiles.map, TextureKeys.terrainGothicTiles.map)

    this.load.image(TextureKeys.annie.name, TextureKeys.annie.path)
    this.load.image(TextureKeys.cowardDog.name, TextureKeys.cowardDog.path)

    this.load.image(TextureKeys.whitePlatformTile.name, TextureKeys.whitePlatformTile.path)
    this.load.image(TextureKeys.bluePlatformTile.name, TextureKeys.bluePlatformTile.path)

    this.load.image(TextureKeys.collectibleR.name, TextureKeys.collectibleR.path)
    this.load.image(TextureKeys.collectibleRBar.name, TextureKeys.collectibleRBar.path)
    this.load.image(TextureKeys.collectibleRPin.name, TextureKeys.collectibleRPin.path)

    this.load.image(TextureKeys.controlsSchema.name, TextureKeys.controlsSchema.path)

    this.load.image(TextureKeys.wisteriaPetal.name, TextureKeys.wisteriaPetal.path)
    this.load.image(TextureKeys.greenLeave.name, TextureKeys.greenLeave.path)

    this.load.image(TextureKeys.moonBackground.name, TextureKeys.moonBackground.path)
    this.load.image(TextureKeys.graveyardBackground.name, TextureKeys.graveyardBackground.path)
    this.load.image(TextureKeys.mountainsBackground.name, TextureKeys.mountainsBackground.path)
  }

  create() {
    // this.anims.create({
    //   key: 'dead',
    //   frames: this.anims.generateFrameNames(TextureKeys.rocketMouse.name, {
    //     prefix: 'rocketmouse_dead',
    //     start: 2,
    //     end: 2,
    //     zeroPad: 2
    //   }),
    //   frameRate: 8
    // })

    // this.anims.create({
    //   key: 'run',
    //   frames: this.anims.generateFrameNames(TextureKeys.rocketMouse.name, {
    //     prefix: 'rocketmouse_run',
    //     start: 1,
    //     end: 4,
    //     zeroPad: 2
    //   }),
    //   frameRate: 8,
    //   repeat: -1
    // })

    // this.anims.create({
    //   key: 'fall',
    //   frames: this.anims.generateFrameNames(TextureKeys.rocketMouse.name, {
    //     prefix: 'rocketmouse_fall',
    //     start: 1,
    //     end: 1,
    //     zeroPad: 2
    //   }),
    //   frameRate: 8,
    //   repeat: -1
    // })

    // this.anims.create({
    //   key: 'idle',
    //   frames: this.anims.generateFrameNames(TextureKeys.rocketMouse.name, {
    //     prefix: 'rocketmouse_run',
    //     start: 1,
    //     end: 1,
    //     zeroPad: 2
    //   }),
    //   frameRate: 8,
    //   repeat: -1
    // })

    // this.anims.create({
    //   key: 'flying',
    //   frames: this.anims.generateFrameNames(TextureKeys.rocketMouse.name, {
    //     prefix: 'rocketmouse_flying',
    //     start: 1,
    //     end: 1,
    //     zeroPad: 2
    //   }),
    //   frameRate: 8,
    //   repeat: -1
    // })

    this.scene.start('Title')
  }
}

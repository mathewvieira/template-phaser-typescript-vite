import { Scene } from 'phaser'

import { TextureKeys } from '../Utils/TextureKeys'

export class Preloader extends Scene {
  constructor() {
    super('Preloader')
  }

  init() {
    this.add.image(512, 384, TextureKeys.GradientBackground.name)

    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff)

    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff)

    this.load.on('progress', (progress: number) => {
      bar.width = 4 + 460 * progress
    })
  }

  preload() {
    this.load.setPath('assets')

    this.load.image(TextureKeys.TerrainTiles.name, TextureKeys.TerrainTiles.path)
    this.load.tilemapTiledJSON(TextureKeys.TerrainTiles.map, TextureKeys.TerrainTiles.map)

    this.load.image(TextureKeys.TerrainGothicTiles.name, TextureKeys.TerrainGothicTiles.path)
    this.load.tilemapTiledJSON(TextureKeys.TerrainGothicTiles.map, TextureKeys.TerrainGothicTiles.map)

    this.load.atlas(TextureKeys.RocketMouse.name, TextureKeys.RocketMouse.path, TextureKeys.RocketMouse.map)

    this.load.image(TextureKeys.HouseBackground.name, TextureKeys.HouseBackground.path)

    this.load.image(TextureKeys.CowardDog.name, TextureKeys.CowardDog.path)

    this.load.image(TextureKeys.MoonBackground.name, TextureKeys.MoonBackground.path)
    this.load.image(TextureKeys.GraveyardBackground.name, TextureKeys.GraveyardBackground.path)
    this.load.image(TextureKeys.MountainsBackground.name, TextureKeys.MountainsBackground.path)
  }

  create() {
    this.anims.create({
      key: 'dead',
      frames: this.anims.generateFrameNames(TextureKeys.RocketMouse.name, {
        prefix: 'rocketmouse_dead',
        start: 2,
        end: 2,
        zeroPad: 2
      }),
      frameRate: 8
    })

    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNames(TextureKeys.RocketMouse.name, {
        prefix: 'rocketmouse_run',
        start: 1,
        end: 4,
        zeroPad: 2
      }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'fall',
      frames: this.anims.generateFrameNames(TextureKeys.RocketMouse.name, {
        prefix: 'rocketmouse_fall',
        start: 1,
        end: 1,
        zeroPad: 2
      }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNames(TextureKeys.RocketMouse.name, {
        prefix: 'rocketmouse_run',
        start: 1,
        end: 1,
        zeroPad: 2
      }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'flying',
      frames: this.anims.generateFrameNames(TextureKeys.RocketMouse.name, {
        prefix: 'rocketmouse_flying',
        start: 1,
        end: 1,
        zeroPad: 2
      }),
      frameRate: 8,
      repeat: -1
    })

    this.scene.start('MainMenu')
  }
}

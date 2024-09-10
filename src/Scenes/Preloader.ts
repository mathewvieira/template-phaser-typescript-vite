import { Scene } from 'phaser'

export class Preloader extends Scene {
  constructor() {
    super('Preloader')
  }

  init() {
    this.add.image(512, 384, 'background')

    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff)

    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff)

    this.load.on('progress', (progress: number) => {
      bar.width = 4 + 460 * progress
    })
  }

  preload() {
    this.load.setPath('assets')

    this.load.image('logo', 'img/logo.png')

    this.load.image('terrain-tiles', 'sprites/tiles/terrain-32x32.png')
    this.load.tilemapTiledJSON('terrain-map', 'sprites/tiles/terrain-32x32.json')

    this.load.atlas('rocketmouse', 'sprites/characters/rocketmouse/rocketmouse.png', 'sprites/characters/rocketmouse/rocketmouse.json')

    this.load.image('bg-house', 'sprites/scenario/bg_repeat_340x640.png')

    this.load.image('coward', 'sprites/characters/coward/coward.png')

    this.load.image('bg-moon', 'sprites/scenario/ghotic/background.png')
    this.load.image('bg-graveyard', 'sprites/scenario/ghotic/graveyard.png')
    this.load.image('bg-mountains', 'sprites/scenario/ghotic/mountains.png')
  }

  create() {
    this.anims.create({
      key: 'dead',
      frames: this.anims.generateFrameNames('rocketmouse', {
        prefix: 'rocketmouse_dead',
        start: 2,
        end: 2,
        zeroPad: 2,
      }),
      frameRate: 8,
    })

    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNames('rocketmouse', {
        prefix: 'rocketmouse_run',
        start: 1,
        end: 4,
        zeroPad: 2,
      }),
      frameRate: 8,
      repeat: -1,
    })

    this.anims.create({
      key: 'fall',
      frames: this.anims.generateFrameNames('rocketmouse', {
        prefix: 'rocketmouse_fall',
        start: 1,
        end: 1,
        zeroPad: 2,
      }),
      frameRate: 8,
      repeat: -1,
    })

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNames('rocketmouse', {
        prefix: 'rocketmouse_run',
        start: 1,
        end: 1,
        zeroPad: 2,
      }),
      frameRate: 8,
      repeat: -1,
    })

    this.anims.create({
      key: 'flying',
      frames: this.anims.generateFrameNames('rocketmouse', {
        prefix: 'rocketmouse_flying',
        start: 1,
        end: 1,
        zeroPad: 2,
      }),
      frameRate: 8,
      repeat: -1,
    })

    this.scene.start('MainMenu')
  }
}

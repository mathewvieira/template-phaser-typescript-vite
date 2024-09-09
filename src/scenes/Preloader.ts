import { Scene } from 'phaser'

export class Preloader extends Scene {
  constructor() {
    super('Preloader')
  }

  init() {
    //  We loaded this image in our Boot Scene, so we can display it here
    this.add.image(512, 384, 'background')

    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff)

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff)

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on('progress', (progress: number) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress
    })
  }

  preload() {
    this.load.setPath('assets')

    this.load.image('logo', 'img/logo.png')

    this.load.image('terrain-tiles', 'sprites/tiles/terrain-32x32.png')
    this.load.tilemapTiledJSON('terrain-map', 'sprites/tiles/terrain-32x32.json')

    this.load.atlas(
      'rocketmouse',
      'sprites/characters/rocketmouse/rocketmouse.png',
      'sprites/characters/rocketmouse/rocketmouse.json'
    )

    this.load.image('coward', 'sprites/characters/coward/coward.png')

    this.load.image('backgroundTest', 'sprites/scenario/ghotic/background.png')
    this.load.image('graveyard', 'sprites/scenario/ghotic/graveyard.png')
    this.load.image('mountains', 'sprites/scenario/ghotic/mountains.png')
  }

  create() {
    this.anims.create({
      key: 'dead',
      frames: this.anims.generateFrameNames('rocketmouse', {
        prefix: 'rocketmouse_dead',
        start: 2,
        end: 2,
        zeroPad: 2
      }),
      frameRate: 8
    })

    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNames('rocketmouse', {
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
      frames: this.anims.generateFrameNames('rocketmouse', {
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
      frames: this.anims.generateFrameNames('rocketmouse', {
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
      frames: this.anims.generateFrameNames('rocketmouse', {
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

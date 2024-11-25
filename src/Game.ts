import { Game } from 'phaser'

import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js'

import { Boot } from './Scenes/Boot'
import { Intro } from './Scenes/Intro'
import { GameOver } from './Scenes/GameOver'
import { Title } from './Scenes/Title'
import { Preloader } from './Scenes/Preloader'

declare module 'phaser' {
  interface Scene {
    rexUI: RexUIPlugin
  }
}

export const PhaserGame = new Game({
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  parent: 'game-container',
  backgroundColor: '#028af8',
  pixelArt: true,
  fps: { min: 30, target: 60 },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { x: 0, y: 300 }
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  input: {
    keyboard: true
  },
  scene: [Boot, Preloader, Title, Intro, GameOver],
  plugins: {
    scene: [
      {
        key: 'rexUI',
        plugin: RexUIPlugin,
        mapping: 'rexUI'
      }
    ]
  }
})

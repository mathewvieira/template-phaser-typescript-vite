import { Game } from 'phaser'

import { Boot } from './src/Scenes/Boot'
import { MainGame } from './src/Scenes/MainGame'
import { GameOver } from './src/Scenes/GameOver'
import { MainMenu } from './src/Scenes/MainMenu'
import { InfiniteScroller } from './src/Scenes/InfiniteScroller'
import { Preloader } from './src/Scenes/Preloader'

export default new Game({
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  parent: 'game-container',
  backgroundColor: '#028af8',
  // antialias: false,
  // pixelArt: true,
  fps: { min: 30, target: 60 },
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
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
  scene: [Boot, Preloader, InfiniteScroller, MainMenu, MainGame, GameOver]
})

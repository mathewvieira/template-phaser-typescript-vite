import { Boot } from './src/Scenes/Boot'
import { MainGame } from './src/Scenes/MainGame'
import { GameOver } from './src/Scenes/GameOver'
import { MainMenu } from './src/Scenes/MainMenu'
import { InfiniteScroller } from './src/Scenes/InfiniteScroller'
import { Preloader } from './src/Scenes/Preloader'

import { Game, Types } from 'phaser'

const config: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  parent: 'game-container',
  backgroundColor: '#028af8',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 300 },
      debug: true,
      fps: 60,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  input: {
    keyboard: true,
  },
  scene: [Boot, Preloader, InfiniteScroller, MainMenu, MainGame, GameOver],
}

export default new Game(config)

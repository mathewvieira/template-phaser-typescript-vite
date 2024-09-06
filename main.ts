import { Boot } from './src/scenes/Boot'
import { Game as MainGame } from './src/scenes/Game'
import { GameOver } from './src/scenes/GameOver'
import { MainMenu } from './src/scenes/MainMenu'
import { Preloader } from './src/scenes/Preloader'

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
      fps: 60
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  input: {
    keyboard: true
  },
  scene: [Boot, Preloader, MainMenu, MainGame, GameOver]
}

export default new Game(config)

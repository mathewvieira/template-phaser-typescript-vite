import { Game } from 'phaser'

import { Boot } from './Scenes/Boot'
import { MainGame } from './Scenes/MainGame'
import { GameOver } from './Scenes/GameOver'
import { MainMenu } from './Scenes/MainMenu'
import { Preloader } from './Scenes/Preloader'

export const phaserGame = new Game({
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
  scene: [Boot, Preloader, MainMenu, MainGame, GameOver]
})

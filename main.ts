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
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [Boot, Preloader, MainMenu, MainGame, GameOver],
}

export default new Game(config)

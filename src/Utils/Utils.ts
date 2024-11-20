import { phaserGame } from '../Game'

export function isDebugMode(): boolean {
  return phaserGame.config.physics.arcade ? phaserGame.config.physics.arcade.debug! : false
}

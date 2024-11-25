export enum KeyCode {
  LEFT = Phaser.Input.Keyboard.KeyCodes.LEFT,
  RIGHT = Phaser.Input.Keyboard.KeyCodes.RIGHT,
  UP = Phaser.Input.Keyboard.KeyCodes.UP,
  DOWN = Phaser.Input.Keyboard.KeyCodes.DOWN,
  SPACE = Phaser.Input.Keyboard.KeyCodes.SPACE,
  SHIFT = Phaser.Input.Keyboard.KeyCodes.SHIFT,
  W = Phaser.Input.Keyboard.KeyCodes.W,
  A = Phaser.Input.Keyboard.KeyCodes.A,
  S = Phaser.Input.Keyboard.KeyCodes.S,
  D = Phaser.Input.Keyboard.KeyCodes.D
}

export const { LEFT, RIGHT, UP, DOWN, SPACE, W, A, S, D } = KeyCode

export type CustomKeyboard = Record<KeyCode, Phaser.Input.Keyboard.Key>

export type GameSize = { width: number; height: number }

export interface IDebugObjects {
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
  camera: Phaser.Cameras.Scene2D.Camera
  game: Phaser.Game
  world: Phaser.Physics.Arcade.World
}

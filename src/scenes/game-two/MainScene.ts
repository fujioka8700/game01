import * as Phaser from 'phaser';

export class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }
  preload(): void {
    this.load.image('logo', 'assets/game-two/phaser-logo.png');
  }
  create(): void {
    this.add.image(400, 300, 'logo');
  }
  update(): void {}
}

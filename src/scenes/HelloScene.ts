import * as Phaser from 'phaser';

export class HelloScene extends Phaser.Scene {
  constructor() {
    super('HelloScene');
  }

  preload() {
    // 常に最新のアセットをロード
  }

  create() {
    const screenWidth = 600;
    const screenHeight = 600;

    this.add
      .text(screenWidth / 2, screenHeight / 2, 'Hello World (自動更新版)', {
        fontSize: '36px',
        color: '#ffff00',
      })
      .setOrigin(0.5);
  }

  update() {
    // ゲームループのロジック
  }
}

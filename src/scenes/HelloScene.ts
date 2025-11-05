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

    // ここを修正すると、自動で更新させたい！
    this.add
      .text(screenWidth / 2, screenHeight / 2, 'Hello World (自動更新版)', {
        fontSize: '36px',
        color: '#ffff00', // 色を黄色に変更して更新をテスト！
      })
      .setOrigin(0.5);
  }

  update() {
    // ゲームループのロジック
  }
}

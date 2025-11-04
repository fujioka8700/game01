import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

// ゲームシーンの定義（ここでは簡単な例）
class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    // 画像などのリソースを読み込む
    this.load.image('logo', './assets/phaser-logo.png'); // publicフォルダに画像を配置
  }

  create() {
    // 画面中央に画像を配置し、回転アニメーションを設定
    const logo = this.add.image(400, 300, 'logo');
    logo.setOrigin(0.5, 0.5);
    this.tweens.add({
      targets: logo,
      angle: 100,
      duration: 2000,
      repeat: -1, // 永久に繰り返す
    });
  }

  update() {
    // フレームごとの更新処理
  }
}

const PhaserGame: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const gameInstance = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    // 既にゲームインスタンスが存在する場合は何もしない（再レンダリング防止）
    if (gameInstance.current) {
      return;
    }

    // Phaserゲーム設定
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO, // WebGLまたはCanvasを選択
      width: 800,
      height: 600,
      parent: gameRef.current || 'phaser-game-container', // ゲームを描画するHTML要素
      scene: [MainScene],
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
    };

    // Phaserゲームを起動
    const game = new Phaser.Game(config);
    gameInstance.current = game;

    // コンポーネントがアンマウントされるときにゲームを破棄
    return () => {
      game.destroy(true);
      gameInstance.current = null;
    };
  }, []);

  return <div ref={gameRef} style={{ width: 800, height: 600 }} />;
};

export default PhaserGame;

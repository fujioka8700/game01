import React, { useEffect, useRef, useMemo } from 'react';
import * as Phaser from 'phaser';
import { ScrollScene } from '@/scenes/ScrollScene';

const PhaserGame = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    // コンポーネントがマウントされたら、Phaserインスタンスを生成
    if (gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO, // レンダリングタイプを指定
      width: 800, // ゲームの幅
      height: 600, // ゲームの高さ
      physics: {
        // 物理エンジンの設定
        default: 'arcade', // 使用する物理エンジンを指定
        arcade: {
          gravity: { x: 0, y: 300 }, // 重力の方向と強さを指定
          debug: false, // デバッグモード
        },
      },
      input: {
        keyboard: true, // ここでキーボード入力を有効にする
      },
      parent: gameContainerRef.current as HTMLElement, // ゲームを描画するコンテナ要素
      scene: ScrollScene, // 使用するシーンを指定
      backgroundColor: '#1e1e1e',
    };

    gameRef.current = new Phaser.Game(config); // Phaserゲームインスタンスを作成

    // クリーンアップ: コンポーネントが破棄されるときにゲームを破壊
    return () => {
      if (gameRef.current) {
        console.log('Phaser Game Destroyed for Hot Reload.');
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={gameContainerRef}
      // Phaserゲームが描画されるコンテナのスタイル
      style={{
        width: '800px',
        height: '600px',
        margin: '20px auto',
      }}
    />
  );
};

const DynamicPhaserWrapper = () => {
  const hotReloadKey = useMemo(() => {
    if (process.env.NODE_ENV === 'development') {
      // Hot Reload/Fast Refresh が走ると、useMemo が再評価されることを利用
      // eslint-disable-next-line react-hooks/purity
      return Date.now();
    }
    return 1;
  }, []);

  // キーが変更されると、Reactは古い PhaserGame コンポーネントを破棄し、新しいものをマウントします。
  return <PhaserGame key={hotReloadKey} />;
};

export default DynamicPhaserWrapper;

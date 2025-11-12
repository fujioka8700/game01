import React, { useEffect, useRef, useMemo } from 'react';
import * as Phaser from 'phaser';
import { MainScene } from '@/scenes/game-two/MainScene';

const PhaserGame = () => {
  // ゲームコンテナの参照とPhaserゲームインスタンスの参照を保持
  // useRef はレンダリング間で値を保持する
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  // コンポーネントがマウントされたら、Phaserインスタンスを生成
  // useEffect はレンダリング後に実行される
  useEffect(() => {
    if (gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 600,
      height: 800,
      parent: gameContainerRef.current as HTMLElement,
      scene: MainScene,
      backgroundColor: '#1e1e1e',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
          width: 300,
          height: 400,
        },
        max: {
          width: 800,
          height: 1000,
        },
      },
    };

    gameRef.current = new Phaser.Game(config);

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
        width: '100vw',
        height: '600px',
        margin: '20px auto',
      }}
    />
  );
};

const PhaserGameTwo = (): React.JSX.Element => {
  // useMemo は重い処理の結果をキャッシュする
  const hotReloadKey = useMemo(() => {
    if (process.env.NODE_ENV === 'development') {
      // Hot Reload/Fast Refresh が走ると、useMemo が再評価されることを利用
      // eslint-disable-next-line react-hooks/purity
      return Date.now();
    }
    return 1;
  }, []);

  return <PhaserGame key={hotReloadKey} />;
};

export default PhaserGameTwo;

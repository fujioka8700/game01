import React, { useEffect, useRef, useMemo } from 'react';
import * as Phaser from 'phaser';
import { HelloScene } from '@/scenes/HelloScene';

const PhaserGame = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    // コンポーネントがマウントされたら、Phaserインスタンスを生成
    if (gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 600,
      height: 600,
      parent: gameContainerRef.current as HTMLElement,
      scene: HelloScene,
      backgroundColor: '#1e1e1e',
    };

    gameRef.current = new Phaser.Game(config);

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
      // スタイルを className に切り出すことも可能ですが、ここではインラインのままに
      style={{
        width: '600px',
        height: '600px',
        margin: '20px auto',
        border: '3px solid #ff0070',
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

'use client';
import React, { useEffect, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';

const DynamicPhaserGame = dynamic(
  async () => {
    const Phaser = await import('phaser');

    class MainScene extends Phaser.Scene {
      constructor() {
        super({ key: 'MainScene' });
      }
      preload(): void {}
      create(): void {}
      update(): void {}
    }

    const PhaserGame = () => {
      const gameContainerRef = useRef<HTMLDivElement>(null);
      const gameRef = useRef<Phaser.Game | null>(null);

      useEffect(() => {
        if (gameRef.current) return;

        const config: Phaser.Types.Core.GameConfig = {
          type: Phaser.AUTO,
          width: 800,
          height: 600,
          parent: gameContainerRef.current as HTMLElement,
          scene: MainScene,
          backgroundColor: '#1e1e1e',
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
          style={{
            width: '100vw',
            height: '600px',
            margin: '20px auto',
          }}
        />
      );
    };

    const DynamicPhaserWrapper = () => {
      const hotReloadKey = useMemo(() => {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line react-hooks/purity
          return Date.now();
        }
        return 1;
      }, []);

      return <PhaserGame key={hotReloadKey} />;
    };

    return { default: DynamicPhaserWrapper };
  },
  {
    ssr: false,
    loading: () => <p>ゲーム起動準備中...</p>,
  },
);

// ----------------------------------------------------
// 3. Pageコンポーネント
// ----------------------------------------------------
const HomePage: React.FC = () => {
  return (
    <div>
      <main>
        <h1>サンプル</h1>
        <DynamicPhaserGame />
      </main>
    </div>
  );
};

export default HomePage;

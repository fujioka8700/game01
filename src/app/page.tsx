'use client';
import React from 'react';
import dynamic from 'next/dynamic';

// PhaserGameコンポーネントを動的にインポートし、サーバーサイドレンダリングを無効化
const DynamicPhaserGame = dynamic(() => import('./components/PhaserGame'), {
  ssr: false,
  loading: () => <p>ゲーム起動準備中...</p>,
});

// ホームページコンポーネント
const HomePage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <main style={{ textAlign: 'center' }}>
        <h1>Next.jsで動くPhaserゲーム！</h1>
        <DynamicPhaserGame />
      </main>
    </div>
  );
};

export default HomePage;

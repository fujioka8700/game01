'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';

// --- これが Next.js + Phaser のキモです ---
// ssr: false を設定して、クライアント側でのみコンポーネントをレンダリングさせる。
const DynamicPhaserGame = dynamic(() => import('./components/PhaserGame'), {
  ssr: false,
  loading: () => <p>ゲーム起動準備中...</p>, // ロード中の表示
});
// ------------------------------------------

const HomePage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <Head>
        <title>Next.js x Phaser Hello World</title>
      </Head>

      <main style={{ padding: '20px' }}>
        <h1>Next.jsで動くPhaserゲーム！</h1>

        {/* 動的インポートしたコンポーネントを配置 */}
        <DynamicPhaserGame />

        <p>↑ 緑色の「Hello World, from Phaser!」が見えたら成功です。</p>
      </main>
    </div>
  );
};

export default HomePage;

'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';

const DynamicPhaserGame = dynamic(() => import('./components/PhaserGame'), {
  ssr: false,
  loading: () => <p>ゲーム起動準備中...</p>,
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

        <DynamicPhaserGame />

        <p>↑ 緑色の「Hello World, from Phaser!」が見えたら成功です。</p>
      </main>
    </div>
  );
};

export default HomePage;

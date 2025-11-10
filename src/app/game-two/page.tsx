'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const DynamicPhaserGame = dynamic(
  () => import('@/app/components/PhaserGameTwo'),
  {
    ssr: false,
    loading: () => <p>ゲーム起動準備中...</p>,
  },
);

const GameTwo = (): React.JSX.Element => {
  return (
    <div>
      <main style={{ textAlign: 'center' }}>
        <DynamicPhaserGame />
      </main>
    </div>
  );
};

export default GameTwo;

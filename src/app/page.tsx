'use client';
import dynamic from 'next/dynamic';

// クライアントサイドでのみ実行されるようにダイナミックインポート
const DynamicPhaserGame = dynamic(() => import('./components/PhaserGame'), {
  ssr: false, // 💡 ここでSSRを無効化することが非常に重要です
  loading: () => <div>Loading Game...</div>, // ロード中に表示するコンポーネント
});

export default function HomePage() {
  return (
    <main
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <DynamicPhaserGame />
    </main>
  );
}

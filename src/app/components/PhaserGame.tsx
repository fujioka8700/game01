import React, { useEffect, useRef, useMemo } from 'react';
import * as Phaser from 'phaser';
// ⭐ 独立させたシーンファイルをインポート ⭐
import { HelloScene } from '@/scenes/HelloScene';
// ↑ パスはプロジェクトの構造に合わせて調整してください。

// ------------------------------------------------------------------
// ⭐ PhaserGame コンポーネント (ゲーム本体) ⭐
// ------------------------------------------------------------------
const PhaserGame: React.FC = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    // 既にゲームがあれば処理しない (キーが変更されたらこれは常に false)
    if (gameRef.current) return;

    // ゲーム設定
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 600,
      height: 600,
      parent: gameContainerRef.current as HTMLElement, // この div に描画
      scene: HelloScene,
      backgroundColor: '#1e1e1e',
    };

    // ゲームインスタンスの作成
    gameRef.current = new Phaser.Game(config);

    // クリーンアップ処理: コンポーネントが破棄されるときにゲームを破壊
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
        width: '600px',
        height: '600px',
        margin: '20px auto',
        border: '3px solid #ff0070',
      }}
    />
  );
};

// ------------------------------------------------------------------
// ⭐ DynamicKeyWrapper コンポーネント (自動リロードの仕掛け) ⭐
// ------------------------------------------------------------------
const DynamicKeyWrapper: React.FC = () => {
  const key = useMemo(() => {
    if (process.env.NODE_ENV === 'development') {
      // ⭐ ここが修正点：ESLint のルールを一時的に無視する ⭐
      // 警告を意図的に無視することで、ホットリロードを強制するハックを維持します。
      // eslint-disable-next-line react-hooks/purity
      return Date.now();
    }
    return 1;
  }, []);

  return <PhaserGame key={key} />;
};

export default DynamicKeyWrapper;

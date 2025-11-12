'use client';
import React, { useEffect, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';

const DynamicPhaserGame = dynamic(
  async () => {
    const Phaser = await import('phaser');

    // ゲーム内のノベルデータ（テキストとキャラクター情報）
    interface NovelLine {
      text: string;
      character: string; // 例えば「ぼく」「小林さん」「真理」など
    }

    class MainScene extends Phaser.Scene {
      private novelData: NovelLine[] = []; // シーン内で使用するノベルデータ

      private currentLineIndex: number = 0;
      private textContainer: Phaser.GameObjects.Graphics | null = null;
      private novelText: Phaser.GameObjects.Text | null = null;
      private nameTag: Phaser.GameObjects.Graphics | null = null;
      private nameText: Phaser.GameObjects.Text | null = null;

      private isTyping: boolean = false; // 現在タイピング中かどうかを示すフラグ
      private currentTypingLine: string = ''; // 現在表示中のテキスト全体
      private typingTimer: Phaser.Time.TimerEvent | null = null; // タイピング制御用のタイマー

      constructor() {
        super({ key: 'MainScene' });
      }

      preload() {
        this.load.json('novelData', 'assets/sample/novel_data.json');
      }

      create() {
        const { width, height } = this.scale;

        // --- 背景（今回はシンプルな色） ---
        this.cameras.main.setBackgroundColor('#f00000');

        // --- 登場人物のシルエット（抽象的な表現） ---
        this.add.rectangle(
          width * 0.5,
          height * 0.4,
          width,
          height * 0.7,
          0x5a3e78,
          0.4,
        );

        // --- テキストコンテナ ---
        const containerHeight = height * 0.3;
        const containerY = height - containerHeight;

        this.textContainer = this.add.graphics();
        this.textContainer.fillStyle(0x000000, 0.85);
        this.textContainer.fillRect(0, containerY, width, containerHeight);

        // --- ノベルテキスト ---
        this.novelText = this.add.text(
          width * 0.05,
          containerY + containerHeight * 0.25,
          '',
          {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff',
            wordWrap: { width: width * 0.9, useAdvancedWrap: true },
          },
        );

        // --- 名前タグ ---
        const nameTagWidth = width * 0.3;
        const nameTagHeight = 40;
        const nameTagX = width * 0.05;
        const nameTagY = containerY - nameTagHeight + 0;

        this.nameTag = this.add.graphics({ x: nameTagX, y: nameTagY });
        this.nameTag.fillStyle(0x000000, 0.9);
        this.nameTag.fillRect(0, 0, nameTagWidth, nameTagHeight);
        this.nameTag.setDepth(1);

        this.nameText = this.add
          .text(nameTagX + 10, nameTagY + 10, '', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#ffffff',
          })
          .setDepth(2);

        // --- クリックイベントの設定 ---
        this.input.on('pointerdown', this.handleInput, this);

        // ロードしたデータを取得
        const novelData: NovelLine[] = this.cache.json.get('novelData');

        // this.nextLine()を呼び出す前に、このnovelDataをシーンのプロパティに保存します
        this.novelData = novelData;

        // 最初の行を表示
        this.nextLine();
      }

      // クリック/タップの処理
      private handleInput() {
        if (this.isTyping) {
          // 1. タイピングアニメーションをスキップ
          this.skipTyping();
        } else {
          // 2. 次の行に進む
          this.nextLine();
        }
      }

      // タイピングをスキップして全文を一瞬で表示する
      private skipTyping() {
        if (this.typingTimer) {
          this.typingTimer.remove();
          this.typingTimer = null;
        }
        this.novelText?.setText(this.currentTypingLine);
        this.isTyping = false;
      }

      // 次のノベルの行を表示する
      private nextLine() {
        if (this.currentLineIndex < this.novelData.length) {
          // 前のタイマーが残っていたら停止
          if (this.typingTimer) {
            this.typingTimer.remove();
          }

          const line = this.novelData[this.currentLineIndex];
          this.currentTypingLine = line.text; // 全文を保存
          this.currentLineIndex++;

          // 2. キャラクター名を更新
          if (line.character === 'ナレーション') {
            this.nameTag?.setVisible(false);
            this.nameText?.setVisible(false);
          } else {
            this.nameTag?.setVisible(true);
            this.nameText?.setVisible(true);
            this.nameText?.setText(line.character);
          }

          // 3. タイピングアニメーションを開始
          this.startTyping(this.currentTypingLine);
        } else {
          // 全てのテキストが表示されたら
          this.novelText?.setText('--- END ---');
          this.nameTag?.setVisible(false);
          this.nameText?.setVisible(false);
          this.input.off('pointerdown', this.handleInput, this);
        }
      }

      // タイピングアニメーションのコアロジック
      private startTyping(fullText: string) {
        if (!this.novelText) return;

        this.isTyping = true;
        this.novelText.setText(''); // 表示中のテキストをリセット

        let charIndex = 0;
        const typingSpeed = 50; // 50ミリ秒ごとに1文字表示（お好みで調整）

        this.typingTimer = this.time.addEvent({
          delay: typingSpeed,
          callback: () => {
            if (charIndex < fullText.length) {
              // 1文字追加してテキストを更新
              this.novelText?.setText(fullText.substring(0, charIndex + 1));
              charIndex++;

              // TODO: ここで文字が表示されるたびにSEを鳴らす処理を追加できます
              // 例: this.sound.play('typing_sound');
            } else {
              // 全ての文字が表示し終わったらタイマーを停止し、タイピングフラグを下ろす
              this.isTyping = false;
              this.typingTimer?.remove();
            }
          },
          callbackScope: this,
          loop: true, // 繰り返し実行
        });
      }
    }

    const PhaserGame = () => {
      const gameContainerRef = useRef<HTMLDivElement>(null);
      const gameRef = useRef<Phaser.Game | null>(null);

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

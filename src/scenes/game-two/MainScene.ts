import * as Phaser from 'phaser';

export class MainScene extends Phaser.Scene {
  // --- ストーリーデータ ---
  private storyQueue: string[] = [
    'ようこそ、シンプルなノベルゲームへ。',
    'これは、PhaserとTypeScriptで作成された、最小限のサンプルです。',
    '（画面をクリックするか、スペースキーを押して進んでください）',
    'ここでは、複雑なクラス分けをせず、シーン内で全ての処理を行います。',
    '次のステップでは、選択肢やBGMなどを追加できます。',
    '物語は、ここから始まる...',
  ];

  // --- 内部状態管理 ---
  private currentDialogIndex: number = 0;
  private dialogText!: Phaser.GameObjects.Text;
  private continueIcon!: Phaser.GameObjects.Triangle;

  // スペースキーオブジェクトを保持するプロパティ
  private nextKey!: Phaser.Input.Keyboard.Key;

  private fullText: string = '';
  private charIndex: number = 0;
  private isTyping: boolean = false;
  private timerEvent!: Phaser.Time.TimerEvent;

  private readonly TYPING_SPEED = 40; // 1文字あたりの表示間隔 (ms)

  constructor() {
    super({ key: 'SimpleNovelScene' });
  }

  create() {
    // --- 1. 背景の作成 (シンプルな黒色) ---
    this.add
      .graphics()
      .fillStyle(0x333333)
      .fillRect(0, 0, 800, 600)
      .setDepth(0);

    // --- 2. ダイアログボックスの描画 ---
    const boxX = 50;
    const boxY = 400;
    const boxW = 700;
    const boxH = 150; // テキストの縦方向の溢れを防ぐため高さを確保

    this.add
      .graphics()
      .setDepth(10)
      .fillStyle(0x0a0a0a, 0.9) // 黒の半透明
      .fillRect(boxX, boxY, boxW, boxH)
      .lineStyle(2, 0xaaaaaa, 1) // 枠線
      .strokeRect(boxX, boxY, boxW, boxH);

    // --- 3. テキストオブジェクトの作成 ---
    this.dialogText = this.add
      .text(boxX + 20, boxY + 20, '', {
        font: '20px Arial', // 縦方向の溢れを防ぐためフォントサイズを調整
        color: '#ffffff',
        wordWrap: { width: boxW - 40 }, // 横方向の折り返し設定
      })
      .setDepth(11);

    // --- 4. 継続アイコンの作成 (右下隅) ---
    this.continueIcon = this.add
      .triangle(
        boxX + boxW - 20,
        boxY + boxH - 20,
        0,
        10,
        10,
        10,
        5,
        0,
        0xffcc66, // 黄金色の三角形
      )
      .setDepth(12)
      .setVisible(false);

    // --- 5. 入力イベントの設定 ---

    // キーオブジェクトを取得
    this.nextKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE, // 83行目
    );

    // 💡 修正 2: nextKeyがnullでないことを確認してからイベントを登録
    if (this.nextKey) {
      this.nextKey.on('down', this.handleInput, this);
    }

    // マウスクリック/タップも監視
    this.input.on('pointerdown', this.handleInput, this);

    // --- 6. ストーリーの開始 ---
    this.startDialog();
  }

  // --- 入力処理 ---
  private handleInput() {
    if (this.isTyping) {
      // タイプ中ならスキップして全文表示
      this.skipTyping();
    } else {
      // 全文表示済みなら次のメッセージへ
      this.currentDialogIndex++;
      this.startDialog();
    }
  }

  // --- ダイアログの開始と制御 ---
  private startDialog() {
    if (this.currentDialogIndex >= this.storyQueue.length) {
      // 物語の終了
      this.finishStory();
      return;
    }

    this.fullText = this.storyQueue[this.currentDialogIndex];
    this.charIndex = 0;
    this.isTyping = true;
    this.dialogText.setText('');
    this.continueIcon.setVisible(false);

    // タイマーイベントを設定し、一文字ずつ表示を開始
    this.timerEvent = this.time.addEvent({
      delay: this.TYPING_SPEED,
      callback: this.onTypeNextChar,
      callbackScope: this,
      loop: true,
    });
  }

  private onTypeNextChar() {
    if (this.charIndex < this.fullText.length) {
      // 1文字追加して表示を更新
      this.dialogText.setText(this.fullText.substring(0, this.charIndex + 1));
      this.charIndex++;
    } else {
      // 全文表示が完了
      this.stopTyping();
      this.continueIcon.setVisible(true);
    }
  }

  private skipTyping() {
    this.stopTyping();
    this.dialogText.setText(this.fullText);
    this.continueIcon.setVisible(true);
  }

  private stopTyping() {
    // timerEvent が存在する場合のみ破棄
    if (this.timerEvent) {
      this.timerEvent.destroy();
    }
    this.isTyping = false;
  }

  private finishStory() {
    this.stopTyping();
    this.continueIcon.setVisible(false);
    this.dialogText.setText('【物語 完】再ロードしてください。');
    // 終了時、全ての入力イベントを停止
    this.nextKey.off('down', this.handleInput, this);
    this.input.off('pointerdown');
  }
}

import * as Phaser from 'phaser';

export class ScrollScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ScrollScene' }); // シーンのキーを指定
  }

  // 初期化
  private _cursorKeys?: Phaser.Types.Input.Keyboard.CursorKeys; // キー入力オブジェクト
  private _player?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody; // プレイヤーキャラクター

  preload(): void {
    // アセットの事前読み込み
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.spritesheet(
      'dude', // キー
      'assets/dude.png', // 画像を指定
      { frameWidth: 32, frameHeight: 48 }, // フレームの幅と高さを指定
    );
  }

  // 初期設定
  create(): void {
    // 背景画像の追加
    this.add.image(400, 300, 'sky');

    // 地面の作成（静的グループ）
    const platforms = this.physics.add.staticGroup();

    // 地面と足場の追加
    platforms.create(400, 568, 'ground').setScale(2).refreshBody(); // 地面

    // プレイヤーキャラクターの作成
    this._player = this.physics.add.sprite(100, 450, 'dude');
    this._player.setBounce(0.2); // 跳ね返りの設定
    this._player.setCollideWorldBounds(true); // 画面外に出ないように設定

    // アニメーションの作成
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 10,
    });

    // プレイヤーと地面の衝突判定を有効化
    this.physics.add.collider(this._player, platforms);

    // プレイヤーを操作するためのキーボードマネージャ反映
    if (this.input.keyboard) {
      this._cursorKeys = this.input.keyboard.createCursorKeys(); // キーボード入力オブジェクトを作成
    } else {
      console.error('Keyboard input not initialized');
    }
  }

  // フレームごとの更新処理
  update(): void {
    // プレイヤーとキーボード入力オブジェクトが存在しない場合は処理を中断
    if (!this._player || !this._cursorKeys) {
      return;
    }

    // 左キーが押されている場合
    if (this._cursorKeys?.left?.isDown) {
      this._player?.setVelocityX(-160);
      this._player?.anims.play('left', true);
    }
    // 右キーが押されている場合
    else if (this._cursorKeys?.right?.isDown) {
      this._player?.setVelocityX(160);
      this._player?.anims.play('right', true);
    }
    // どちらのキーも押されていない場合
    else {
      this._player?.setVelocityX(0);
      this._player?.anims.play('turn');
    }

    // 上キーが押されていて、かつプレイヤーが地面に接触している場合
    if (this._cursorKeys?.up?.isDown && this._player?.body.touching.down) {
      this._player?.setVelocityY(-330);
    }
  }
}

import * as Phaser from 'phaser';

export class ScrollScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ScrollScene' }); // シーンのキーを指定
  }

  // 初期化
  private _cursorKeys?: Phaser.Types.Input.Keyboard.CursorKeys; // キー入力オブジェクト
  private _player?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody; // プレイヤーキャラクター
  private _stars?: Phaser.Physics.Arcade.Group; // 星オブジェクトのグループ
  private _bombs?: Phaser.Physics.Arcade.Group; // ボムオブジェクトのグループ
  private _jumpSfx?: Phaser.Sound.BaseSound | undefined; // ジャンプ音声
  private _bgMusic?: Phaser.Sound.BaseSound | undefined; // 背景音楽
  private _itemGet?: Phaser.Sound.BaseSound | undefined; // アイテム取得音声
  private _gameOverSfx?: Phaser.Sound.BaseSound | undefined; // ゲームオーバー音声
  private _scoretext?: Phaser.GameObjects.Text; // スコア表示テキスト
  private _score: number = 0; // スコア
  private _isGameOver: boolean = false; // ゲームオーバーフラグ

  preload(): void {
    // アセットの事前読み込み
    this.load.image('sky', 'assets/game-one/sky.png');
    this.load.image('ground', 'assets/game-one/platform.png');
    this.load.image('star', 'assets/game-one/star.png');
    this.load.image('bomb', 'assets/game-one/bomb.png');
    this.load.spritesheet(
      'dude', // キー
      'assets/game-one/dude.png', // 画像を指定
      { frameWidth: 32, frameHeight: 48 }, // フレームの幅と高さを指定
    );
    this.load.audio('jumpSound', 'assets/game-one/audio/jump.mp3'); // ジャンプ音声
    this.load.audio('frogMusic', 'assets/game-one/audio/frogMusic.mp3'); // 背景音楽
    this.load.audio('itemGetSound', 'assets/game-one/audio/itemGet.mp3'); // アイテム取得音声
    this.load.audio('gameOver', 'assets/game-one/audio/gameOver.mp3'); // ボム音声
  }

  // 初期設定
  create(): void {
    this._bgMusic = this.sound.add('frogMusic', { loop: true, volume: 0.5 }); // 背景音楽の追加
    this._bgMusic.play(); // 背景音楽の再生

    // 背景画像の追加
    this.add.image(400, 300, 'sky');

    // 地面の作成（静的グループ）
    const platforms = this.physics.add.staticGroup();

    // 地面と足場の追加
    platforms.create(400, 568, 'ground').setScale(2).refreshBody(); // 地面
    platforms.create(600, 450, 'ground'); // 足場1
    platforms.create(300, 150, 'ground'); // 足場2
    platforms.create(750, 300, 'ground'); // 足場3
    platforms.create(10, 350, 'ground'); // 足場3

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

    this._jumpSfx = this.sound.add('jumpSound'); // ジャンプ音声の追加
    this._itemGet = this.sound.add('itemGetSound'); // アイテム取得音声の追加
    this._gameOverSfx = this.sound.add('gameOver'); // ゲームオーバー音声の追加

    // プレイヤーと地面の衝突判定を有効化
    this.physics.add.collider(this._player, platforms);

    // プレイヤーを操作するためのキーボードマネージャ反映
    if (this.input.keyboard) {
      this._cursorKeys = this.input.keyboard.createCursorKeys(); // キーボード入力オブジェクトを作成
    } else {
      console.error('Keyboard input not initialized');
    }

    this.physics.world.gravity.y = 1200; // 重力の設定

    // 星オブジェクトのグループを作成
    this._stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: Phaser.Math.Between(100, 200), stepX: 70 },
    });

    // 各星に跳ね返りの設定をランダムに適用
    this._stars.children.iterate((child: Phaser.GameObjects.GameObject) => {
      const star = child as Phaser.Physics.Arcade.Image;
      star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8)); // 星の跳ね返りをランダムに設定
      return null;
    });
    this.physics.add.collider(this._stars, platforms); // 星と地面の衝突判定を有効化

    // プレイヤーと星の重なり判定を有効化
    this.physics.add.overlap(
      this._player,
      this._stars,
      this.colletStar,
      undefined,
      this,
    );

    // スコア表示テキストの作成
    this._scoretext = this.add.text(16, 16, 'SCORE: 0', {
      fontSize: '20px',
      fontFamily: 'Meiryo, "Hiragino Kaku Gothic ProN", Arial, sans-serif',
      color: '#fff',
    });

    this._bombs = this.physics.add.group(); // ボムオブジェクトのグループを作成
    this.physics.add.collider(this._bombs, platforms); // ボムと地面の衝突判定を有効化
    this.physics.add.collider(
      this._player,
      this._bombs,
      this.hitBomb,
      undefined,
      this,
    ); // プレイヤーとボムの衝突判定を有効化
  }

  // 星を取得したときの処理
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private colletStar(player: any, star: any): void {
    const playerObj =
      player as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    const starObj = star as Phaser.Physics.Arcade.Image;
    starObj.disableBody(true, true); // 星を非表示にして無効化

    this._score += 10; // スコアを10点加算
    this._scoretext?.setText('SCORE: ' + this._score); // スコアを10点加算して表示更新
    this._itemGet?.play(); // アイテム取得音声を再生

    // すべての星を取得した場合、星を再配置
    if (this._stars?.countActive(true) === 0) {
      this._stars.children.iterate((child: Phaser.GameObjects.GameObject) => {
        const starIter = child as Phaser.Physics.Arcade.Image;
        starIter.enableBody(true, starIter.x, 0, true, true); // 星を再表示して有効化

        return null;
      });
      // プレイヤーの現在位置を取得
      const x =
        player.x < 400
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400);

      // ボムの追加
      const bomb: Phaser.Physics.Arcade.Image = this._bombs?.create(
        x,
        Phaser.Math.Between(0, 400),
        'bomb',
      ); // ボムを追加
      bomb.setBounce(1); // 跳ね返りの設定
      bomb.setCollideWorldBounds(true); // 画面外に出ないように設定
      bomb.setVelocity(
        Phaser.Math.Between(-200, 200),
        Phaser.Math.Between(-200, 200),
      ); // ランダムな速度を設定
    }
  }

  // ボムに当たったときの処理
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private hitBomb(player: any, bomb: any): void {
    const playerObj =
      player as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    const bombObj = bomb as Phaser.Physics.Arcade.Image;

    this._gameOverSfx?.play(); // ゲームオーバー音声を再生

    this.physics.pause(); // 物理演算を一時停止
    this._isGameOver = true; // ゲームオーバーフラグを立てる

    playerObj.setTint(0xff0000); // プレイヤーキャラクターを赤くする
    playerObj.anims.pause(); // プレイヤーキャラクターのアニメーションを停止

    this.add.text(300, 250, 'GAME OVER', {
      fontSize: '40px',
      fontFamily: 'Meiryo, "Hiragino Kaku Gothic ProN", Arial, sans-serif',
      color: '#ff0000',
    }); // ゲームオーバーテキストを表示

    if (this._bgMusic?.isPlaying) {
      this._bgMusic.stop(); // 背景音楽を停止
    }

    // 始めからの案内テキストを表示
    this.add.text(300, 320, 'Press SPACE to Restart', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Meiryo, "Hiragino Kaku Gothic ProN", Arial, sans-serif',
    });

    // スペースキーが押されたらリスタート
    this.input.keyboard?.once('keydown-SPACE', () => {
      this.restartGame();
    });
  }

  private restartGame(): void {
    this._isGameOver = false; // ゲームオーバーフラグをリセット

    this._score = 0; // スコアをリセット

    // シーンのリスタート
    this.scene.restart();
  }

  // フレームごとの更新処理
  update(): void {
    // プレイヤーとキーボード入力オブジェクトが存在しない場合は処理を中断
    if (!this._player || !this._cursorKeys) {
      return;
    }

    if (this._isGameOver) {
      return; // ゲームオーバー時は更新処理を行わない
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
      this._player?.setVelocityY(-650);

      this._jumpSfx?.play(); // ジャンプ音声を再生
    }
  }
}

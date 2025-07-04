import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class MainMenu extends Scene {
    player;
    stars;
    bombs;
    score = 0;
    scoreText;

    constructor() {
        super("MainMenu");
    }

    create() {
        const screenWidth = this.game.config.width;
        const screenHeight = this.game.config.height;

        this.add.image(screenWidth / 2, screenHeight / 2, "sky").setScale(screenWidth / 800, screenHeight / 600);
        // this.add.image(screenWidth / 2, screenHeight / 2, "star");

        // 创建平台
        const platforms = this.physics.add.staticGroup();

        // 地面的比例尺
        const scaleX = this.game.config.width / 400;

        platforms
            .create(screenWidth / 2, screenHeight - (32 / 2) * 2, "ground")
            .setScale(scaleX, 2)
            .refreshBody();

        platforms.create(screenWidth / 2 + 200 / 2, screenHeight * (400 / 600), "ground");
        platforms.create(100, (screenHeight * 250) / 600, "ground");
        platforms.create(screenWidth - (300 * 2) / 3, (screenHeight * 200) / 600, "ground");

        // 创建 player
        // 288 * 48
        this.player = this.physics.add.sprite(100, 450, "dude");
        this.player.body.setGravityY(300);
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "turn",
            frames: [{ key: "dude", frame: 4 }],
            frameRate: 20,
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1,
        });

        this.physics.add.collider(this.player, platforms);

        // 添加星星
        this.stars = this.physics.add.group({
            key: "star",
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 },
        });

        this.stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.physics.add.collider(this.stars, platforms);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        this.scoreText = this.add.text(16, 16, "score: 0", { fontSize: "32px", fill: "#000" });

        // 添加炸弹
        this.bombs = this.physics.add.group();
        this.physics.add.collider(this.bombs, platforms);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);

        EventBus.emit("current-scene-ready", this);
    }

    update() {
        if (!this.player) return;

        // 键盘事件
        const cursors = this.input.keyboard.createCursorKeys();
        if (cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play("left", true);
        } else if (cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play("right", true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play("turn");
        }

        if (cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-600);
        }
    }

    // 收集星星
    collectStar(player, star) {
        star.disableBody(true, true);

        this.score += 10;
        this.scoreText.setText("Score: " + this.score);

        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });

            var x = player.x < 400 ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            var bomb = this.bombs.create(x, 16, "bomb");
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
    }

    // 碰撞到炸弹了
    hitBomb(player, bomb) {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play("turn");

        setTimeout(() => {
            this.changeScene();
        }, 1000);
    }

    changeScene() {
        this.destory();
        this.scene.start("GameOver");
    }

    // 销毁
    destory() {
        this.player = null;
        this.stars = null;
        this.bombs = null;
        this.score = 0;
        this.scoreText = null;

        this.anims.remove("left");
        this.anims.remove("turn");
        this.anims.remove("right");
    }
}


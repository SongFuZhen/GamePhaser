import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class GameOver extends Scene {
    constructor() {
        super("GameOver");
    }

    create() {
        const screenWidth = this.game.config.width;
        const screenHeight = this.game.config.height;
        this.cameras.main.setBackgroundColor(0xff0000);

        // this.add.image(512, 384, "background").setAlpha(0.5);

        this.add
            .text(screenWidth / 2, screenHeight / 2 - 100, "Game Over", {
                fontFamily: "Arial Black",
                fontSize: 64,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        // 再来一局
        const again = this.add
            .text(screenWidth / 2, screenHeight / 2, "再来一局", {
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
                fontSize: 30,
                align: "center",
            })
            .setOrigin(0.5);

        again.setInteractive({ useHandCursor: true }); // useHandCursor 可选，显示手型光标

        again.on("pointerdown", () => this.changeScene());
        EventBus.emit("current-scene-ready", this);
    }

    update() {}

    destory() {}

    changeScene() {
        // 销毁
        this.destory();
        this.scene.start("MainMenu");
    }
}


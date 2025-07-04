// import { Boot } from "./scenes/Boot";
// import { Game } from "./scenes/Game";
// import { GameOver } from "./scenes/GameOver";
// import { MainMenu } from "./scenes/MainMenu";
// import { Preloader } from "./scenes/Preloader";

import { Boot } from "./tutorial/Boot";
import { Preloader } from "./tutorial/Preloader";
import { MainMenu } from "./tutorial/MainMenu";
import { GameOver } from "./tutorial/GameOver";

import Phaser from "phaser";

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: "game-container",
    backgroundColor: "#028af8",
    // scene: [Boot, Preloader, MainMenu, Game, GameOver],

    // width: 800,
    // height: 600,
    scene: [Boot, Preloader, MainMenu, GameOver],
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            debug: false,
        },
    },
};

const StartGame = (parent) => {
    return new Phaser.Game({ ...config, parent });
};

export default StartGame;

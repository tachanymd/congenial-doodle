import { generateEnemyChoice } from './game.js';
import { Infomation } from './info.js';
import { toggleDisplay } from './utils.js';

document.getElementById("bgm").play();

// スタートボタンが押されたときの処理
document.getElementById("startButton").addEventListener("click", () => {

    toggleDisplay("enemy", "block");
    toggleDisplay("titleScreen", "none");
    toggleDisplay("totitle", "block");

    generateEnemyChoice();
});

// 更新情報ボタンが押された時の処理
document.getElementById("infoButton").addEventListener("click", () => {
    document.getElementById("infolog").innerHTML = "";

    toggleDisplay("infolog", "block");
    toggleDisplay("titleScreen", "none");
    toggleDisplay("totitle", "block");

    Infomation();
});

// タイトルへ戻るボタンが押された時の処理
document.getElementById("totitlebutton").addEventListener("click", () => {
    location.reload();
});
import { playerActions } from './data.js';
import { skill } from './skilllib.js';
import { generateEnemyChoice } from './game.js';
import { toggleDisplay , reset , Reset } from './utils.js';

export let AddHP = 0;

// スキル追加処理
export function AddSkill(ChooseSkillNo) {
    let skillcount = Object.keys(playerActions).length + 1; // playerActionsのキー数 + 1
    playerActions[`No${skillcount}`] = [skill[ChooseSkillNo]]; // 新しいスキルを追加
    AddHP = Math.floor(Math.random() * 5) + 7;

    reset("log");
    Reset("csb");

    toggleDisplay("enemy-wrapper", "flex");
    toggleDisplay("ChooseSkillbutton","none");

    generateEnemyChoice();
}

// 敵スキル選択
export function ChooseSkill(choosingskill){

    ["log", "choices","hp-container","Ehp-container","AC","EC"].forEach(id => toggleDisplay(id, "none"));
    document.querySelector(".battle-wrapper").style.display = "none";
    // document.getElementById("player-status").style.visibility = "hidden";
    //document.getElementById("enemy-status").style.visibility = "hidden";
    toggleDisplay("blocklog","none");
    toggleDisplay("ChooseSkillbutton","flex");

    const container = document.querySelector(".csb");

    choosingskill.forEach(skill => {

    const button = document.createElement("button");
    button.classList.add("enemy-button");

    const span = document.createElement("span");
    span.innerHTML = skill.A;  // ボタンに敵の名前を設定
    button.appendChild(span);  // ボタンの中に文字を追加

    button.onclick = () => AddSkill(skill.A0);
    container.appendChild(button);
});
}
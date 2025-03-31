import { playerActions } from './data.js';
import { skill } from './skilllib.js';
import { generateEnemyChoice } from './game.js';
import { toggleDisplay , reset } from './utils.js';

export let AddHP = 0;

// スキル追加処理
export function AddSkill(ChooseSkillNo) {
    let skillcount = Object.keys(playerActions).length + 1; // playerActionsのキー数 + 1
    playerActions[`No${skillcount}`] = [skill[ChooseSkillNo]]; // 新しいスキルを追加
    AddHP = Math.floor(Math.random() * 5) + 7;

    reset("log");
    reset("ChooseSkillbutton");

    toggleDisplay("enemy", "block");

    generateEnemyChoice();
}

// 敵スキル選択
export function ChooseSkill(choosingskill){

    ["log", "choices", "status","hp-container","Ehp-container","AC","EC"].forEach(id => toggleDisplay(id, "none"));

    const container = document.getElementById("ChooseSkillbutton");

    container.innerHTML = "<h1>デッキに入れるスキルを選んでください</h1>";

    choosingskill.forEach(skill => {
    const button = document.createElement("button");
    button.textContent = skill.A;
    button.onclick = () => AddSkill(skill.A0);
    container.appendChild(button);
});
}
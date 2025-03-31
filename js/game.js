import { enemies, playerActions } from './data.js';
import { getRandom, applyDamage , toggleDisplay , setbar } from './utils.js';
import { ChooseSkill , AddHP } from './getskill.js';

// ステータス管理
let MaxHP = 20, HP = 20 , Sh = 0, Mana = 0, Dif = 0, MaxEHP = 20 , EHP = 20, ESh = 0, EMana = 0, EDif = 0, End = 0, level = 1;
export let Choosing = [];
const ENEMY_ACTION_DELAY = 2000;

// ゲーム開始
export function GameStart(enemyActions) {
    toggleDisplay("enemy", "none");
    ["log", "choices", "status","hp-container","Ehp-container","AC","EC"].forEach(id => toggleDisplay(id, "block"));

    MaxHP += AddHP, HP = MaxHP, Sh = 0, Mana = 0, Dif = 0, MaxEHP = (level-1)*10 + 1, EHP = MaxEHP, ESh = 0, EMana = 0, EDif = 0, End = 0;

    updateStatus();
    setbar(HP,MaxHP,EHP,MaxEHP);
    generateChoices(enemyActions);
}

// 敵選択
export function generateEnemyChoice() {
    const choicesDiv = document.getElementById("enemy");
    choicesDiv.innerHTML = "<h1>戦う敵を選んでください</h1>";

    const randomEnemies = getRandom(enemies, 3, 1);

    randomEnemies.forEach(enemy => {
        const button = document.createElement("button");
        button.innerHTML = enemy.name;
        button.onclick = () => GameStart(enemy.actions);
        choicesDiv.appendChild(button);
    });
}

// プレイヤー行動ボタンの生成
function generateChoices(EnemyAction) {
    const choicesDiv = document.getElementById("choices");
    choicesDiv.innerHTML = ""; // ボタンをリセット

    // ランダムに3つの選択肢を作成
    const randomChoices = getRandom(playerActions, 3, 0);

    // それぞれの技でボタンを作成
    randomChoices.forEach(action => {
        const button = document.createElement("button");
        button.innerHTML = `${action.A} ${action.A1}`; // 技名と説明をボタンに表示
        button.onclick = () => {
            showText(action, EnemyAction); // ボタンがクリックされた時に実行される関数
        }
        choicesDiv.appendChild(button); // ボタンを画面に追加
    });
}

// ステータス更新
function updateStatus() {
    document.getElementById("status").innerHTML =
        `<pre class="info-text">あなた：HP ${HP}/${MaxHP} / シールド ${Sh} / マナ ${Mana}         あいて：HP ${EHP}/${MaxEHP} / シールド ${ESh} / マナ ${EMana}</pre>`;
}

// プレイヤーと敵の行動処理
function showText(playerAction,EnemyAction) {
    if (End !== 0) return; // ゲーム終了後は無効

    const log = document.getElementById("log");
    const choicesDiv = document.getElementById("choices");

    choicesDiv.innerHTML = ""; // ボタンを消す

    // 1. プレイヤーの行動処理----------------------------------------------------------------------------
    let actionMessage = `${playerAction.A} を発動！`;

    if (playerAction.F > Mana) {
        // マナ不足の場合
        actionMessage = `マナが不足しているため、${playerAction.A}は発動できません。`;
        playerAction = { A: "行動不能", B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0 }; // 行動を無効にする
    } else {
        if(Math.abs(playerAction.B) != 0){
            const result = applyDamage(EHP, ESh, Math.abs(playerAction.B), playerAction.G, EDif);
            MaxEHP += playerAction.B1;
            EHP = result.targetHP;
            if(EHP>MaxEHP){
                EHP = MaxEHP;
            }
            ESh = result.targetShield;
        }
        EDif += playerAction.H
        Sh += playerAction.C; // シールド増加
        MaxHP += playerAction.C1;
        HP += playerAction.D; // HP回復
        if(HP>MaxHP){
            HP = MaxHP;
        }
        Mana += playerAction.E; // マナの増減

        setbar(HP,MaxHP,EHP,MaxEHP);

    }

    // 2. 勝利判定---------------------------------------------------------------------------------------
    if (EHP <= 0) {
        End = 1;
    }

    // プレイヤーの行動をログに追加
    log.innerHTML += `<br>${actionMessage}`;
    log.scrollTop = log.scrollHeight; // ログをスクロールして最新を表示

    updateStatus();

    // 3. 敵の行動処理  2秒後に敵の行動を表示--------------------------------------------------------------
    setTimeout(() => {
        let enemyMessage = "";
        if (End === 0) {
            const enemyAction = getRandomEnemyAction(EnemyAction,EMana);
            enemyMessage = enemyAction.A;

            // 敵の攻撃処理
            if (Math.abs(enemyAction.B) != 0){
                const result = applyDamage(HP, Sh, Math.abs(enemyAction.B), enemyAction.G, Dif);
                MaxHP += enemyAction.B1
                HP = result.targetHP;
                Sh = result.targetShield;
            }
            Dif += enemyAction.H;
            // 敵の回復・防御
            EHP += enemyAction.C;
            if(EHP>MaxEHP){
                EHP = MaxEHP;
            }
            ESh += enemyAction.D;
            EMana += enemyAction.E;

            setbar(HP,MaxHP,EHP,MaxEHP);

        }

        // 4. 敗北判定-----------------------------------------------------------------------------------
        if (HP <= 0 && End === 0) {
            End = 2;
        }

        // 5. ログに敵の行動を追加　(決着済の場合無効化)----------------------------------------------------
        if ( End === 0 || End === 2 ){
            log.innerHTML += `<br>あいては「${enemyMessage}」を発動！`;
            log.scrollTop = log.scrollHeight; // ログをスクロールして最新を表示
        }

        // 6. 結果の表示---------------------------------------------------------------------------------
        if (End === 1) {
            log.innerHTML += `<br>あなたの勝利！`;
            setTimeout(() => {
                ChooseSkill(EnemyAction);
            },ENEMY_ACTION_DELAY);

        } else if (End === 2) {
            log.innerHTML += `<br>あなたは負けてしまった！`;
        } else {
            generateChoices(EnemyAction); // 次のターンの選択肢を生成
        }

        // 7. ステータス更新------------------------------------------------------------------------------
        updateStatus();

    }, ENEMY_ACTION_DELAY);
}

// 敵の行動を処理
function getRandomEnemyAction(selectedEnemyActions, enemyMana) {
    const filteredActions = selectedEnemyActions.map(action => {
        // マナが足りない場合は確率を0にする
        return (enemyMana < action.F) ? { ...action, A1: 0 } : action;
    });

    // 確率の合計を再計算
    const totalProbability = filteredActions.reduce((sum, action) => sum + action.A1, 0);

    // もしすべての確率が0なら、マナ不要な行動を強制選択
    if (totalProbability === 0) {
        return filteredActions.find(action => action.F === 0) || { A0: 0, A1: 1, A: "わるあがき", B: 1, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0 };
    }

    // 乱数を使って確率に応じた行動を選択
    const randomNum = Math.random() * totalProbability;
    let cumulativeProbability = 0;

    for (const action of filteredActions) {
        cumulativeProbability += action.A1;
        if (randomNum <= cumulativeProbability) {
            return action;
        }
    }

    // 万が一失敗した場合はデフォルトで最初の行動
return filteredActions.find(action => action.F === 0) || { A0: 0, A1: 1, A: "わるあがき", B: 1, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0 };
}
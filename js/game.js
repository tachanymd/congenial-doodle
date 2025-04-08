import { enemies, playerActions , EnemyName } from './data.js';
import { getRandom, applyDamage , toggleDisplay , setbar , toggleClassDisplay , Reset , EnemyBlock } from './utils.js';
import { ChooseSkill , AddHP } from './getskill.js';
import { Turn } from './Turn.js';

// ステータス管理
let MaxHP = 20, HP = 20 , Sh = 0, Mana = 0, Dif = 0, MaxEHP = 20 , EHP = 20, ESh = 0, EMana = 0, EDif = 0, End = 0, level = 1;
let Pow = 0 , EPow = 0 , Spef = 0 , ESpef = 0 , Spefnum = 0 , ESpefnum = 0 ;
let Draw = 3;
let RMana = 0, BMana = 0, YMana = 0, REMana = 0, BEMana = 0, YEMana = 0;
export let Choosing = [];
const ENEMY_ACTION_DELAY = 2000;
let Pelim = [];
let Eelim = [];

// ゲーム開始
export function GameStart(enemyActions) {
    toggleDisplay("enemy-wrapper", "none");
    ["choices","hp-container","Ehp-container","AC","EC","blocklog"].forEach(id => toggleDisplay(id, "block"));
    ["AH","EH"].forEach(id => toggleDisplay(id, "flex"));
    toggleClassDisplay(".battle-wrapper","flex");

    MaxHP += AddHP, HP = MaxHP, Sh = 0, Mana = 0, Dif = 0, MaxEHP = (level-1)*10 + 20, EHP = MaxEHP, ESh = 0, EMana = 0, EDif = 0, End = 0;

    //テスト用
    MaxEHP = 1, EHP = MaxEHP;
    //テスト用

    Reset("enemy");

    updateStatus();
    setbar(HP,MaxHP,EHP,MaxEHP);
    generateChoices(enemyActions);
}

// 敵選択
export function generateEnemyChoice() {
    const enemyWrapper = document.querySelector(".enemy");

    const randomEnemies = getRandom(enemies, 3, 1);

    randomEnemies.forEach(enemy => {
        const button = document.createElement("button");
        button.classList.add("enemy-button");

        const span = document.createElement("span");

        let EN = EnemyName[enemy.name];

        span.innerHTML = EN;  // ボタンに敵の名前を設定
        button.appendChild(span);  // ボタンの中に文字を追加

        button.onclick = () => {
            EnemyBlock(enemy.name);
            GameStart(enemy.actions);
        }
        enemyWrapper.appendChild(button);
    });
}

// プレイヤー行動ボタンの生成
function generateChoices(EnemyAction) {

    if(Spef === 2){
        Spef = 0;
        for(let n = 0; n<Spefnum; n++){
            Draw += 1;
        }
        Spefnum = 0;
    }

    const choicesDiv = document.getElementById("choices");
    choicesDiv.innerHTML = ""; // ボタンをリセット
    const tooltip = document.getElementById("tooltip");

    const randomChoices = getRandom(playerActions, Draw, 0);

    randomChoices.forEach((action,index) => {
        const buttonImage = document.createElement("img");
        buttonImage.src = `./png/button/${action.No}.png`;
        buttonImage.classList.add("special-button");

        const totalButtons = randomChoices.length;
        const spacing = 100; // ボタン同士の間隔（px）

        // 中央基準で左右に配置（真ん中のボタンが50%、他は左右にずらす）
        const offset = (index - (totalButtons - 1) / 2) * spacing;
        buttonImage.style.left = `calc(50% + ${offset}px)`;

        // クリックイベント
        buttonImage.onclick = () => {
            showText(action, EnemyAction);
            tooltip.style.display = "none";
        };

        buttonImage.addEventListener("mouseenter", (e) => {
            const rect = document.querySelector('.fixed-resolution').getBoundingClientRect();
            tooltip.style.display = "block";
            tooltip.textContent = `${action.A}：${action.A1}`;
            tooltip.style.left = `${e.clientX - rect.left + 10}px`;
            tooltip.style.top = `${e.clientY - rect.top - 40}px`;
        });

        buttonImage.addEventListener("mousemove", (e) => {
            const rect = document.querySelector('.fixed-resolution').getBoundingClientRect();
            tooltip.style.left = `${e.clientX - rect.left + 10}px`;
            tooltip.style.top = `${e.clientY - rect.top - 40}px`;
        });

        buttonImage.addEventListener("mouseleave", () => {
            tooltip.style.display = "none";
        });

        choicesDiv.appendChild(buttonImage);
    });
}

// ステータス更新
function updateStatus() {
    // 先に現在の内容をクリア
    document.querySelector(".emana-set").innerHTML = '';  // または、'beforeend'/'afterbegin'で追加する際に既存の内容を消す
    document.querySelector(".mana-set").innerHTML = '';
    document.querySelector(".esh-set").innerHTML = '';
    document.querySelector(".sh-set").innerHTML = '';

    // 更新する内容を追加
    document.querySelector(".emana-set").insertAdjacentHTML('afterbegin', `🔴${RMana} 🔵${BMana} 🟡${YMana}`);
    document.querySelector(".emana-set").insertAdjacentHTML('afterbegin', '<img src="./png/Mana.png" id="AM">');

    document.querySelector(".mana-set").insertAdjacentHTML('beforeend', `${YEMana}🟡 ${BEMana}🔵 ${REMana}🔴`);
    document.querySelector(".mana-set").insertAdjacentHTML('beforeend', '<img src="./png/Mana.png" id="EM">');

    document.querySelector(".esh-set").insertAdjacentHTML('afterbegin', `${Sh}`);
    document.querySelector(".esh-set").insertAdjacentHTML('afterbegin', '<img src="./png/Sh.png" id="AS">');

    document.querySelector(".sh-set").insertAdjacentHTML('beforeend', `${ESh}`);
    document.querySelector(".sh-set").insertAdjacentHTML('beforeend', '<img src="./png/Sh.png" id="ES">');
}

// プレイヤーと敵の行動処理
function showText(playerAction,EnemyAction) {

    Draw = 3;

    if (End !== 0) return; // ゲーム終了後は無効

    const log = document.getElementById("log");
    const choicesDiv = document.getElementById("choices");

    choicesDiv.innerHTML = ""; // ボタンを消す

    let PlayerTurn = Turn(1,playerAction,Spef,Spefnum,RMana,BMana,YMana,EHP,ESh,EDif,Pow,MaxEHP,ESpef,ESpefnum,Eelim,Sh,MaxHP,HP,EPow,Pelim);

    Spef     = PlayerTurn.MySpef;
    Spefnum  = PlayerTurn.MySpefnum;
    RMana    = PlayerTurn.RMyMana;
    BMana    = PlayerTurn.BMyMana;
    YMana    = PlayerTurn.YMyMana;
    EHP      = PlayerTurn.YourHP;
    ESh      = PlayerTurn.YourSh;
    EDif     = PlayerTurn.YourDif;
    Pow      = PlayerTurn.MyPow;
    MaxEHP   = PlayerTurn.MaxYourHP;
    ESpef    = PlayerTurn.YourSpef;
    ESpefnum = PlayerTurn.YourSpefnum;
    Eelim    = PlayerTurn.Yourelim;
    Sh       = PlayerTurn.MySh;
    MaxHP    = PlayerTurn.MyMaxHP;
    HP       = PlayerTurn.MyHP;
    EPow     = PlayerTurn.YourPow;
    Pelim    = PlayerTurn.Myelim;

    // 勝利判定---------------------------------------------------------------------------------------
    if (EHP <= 0) {
        End = 1;
    }

    updateStatus();

    // 敵の行動処理  2秒後に敵の行動を表示--------------------------------------------------------------
    setTimeout(() => {
        let enemyMessage = "";
        if (End === 0) {
            let enemyAction = getRandomEnemyAction(EnemyAction,REMana,BMana,YMana);

            let EnemyTurn = Turn(0,enemyAction,ESpef,ESpefnum,REMana,BEMana,YEMana,HP,Sh,Dif,EPow,MaxHP,Spef,Spefnum,Pelim,ESh,MaxEHP,EHP,Pow,Eelim);

            ESpef     = EnemyTurn.MySpef;
            ESpefnum  = EnemyTurn.MySpefnum;
            REMana    = EnemyTurn.RMyMana;
            BEMana    = EnemyTurn.BMyMana;
            YEMana    = EnemyTurn.YMyMana;
            HP        = EnemyTurn.YourHP;
            Sh        = EnemyTurn.YourSh;
            Dif       = EnemyTurn.YourDif;
            EPow      = EnemyTurn.MyPow;
            MaxHP     = EnemyTurn.MaxYourHP;
            Spef      = EnemyTurn.YourSpef;
            Spefnum   = EnemyTurn.YourSpefnum;
            Pelim     = EnemyTurn.Yourelim;
            ESh       = EnemyTurn.MySh;
            MaxEHP    = EnemyTurn.MyMaxHP;
            EHP       = EnemyTurn.MyHP;
            EPow      = EnemyTurn.YourPow;
            Eelim     = EnemyTurn.Myelim;
        }

        // 4. 敗北判定-----------------------------------------------------------------------------------
        if (HP <= 0 && End === 0) {
            End = 2;
        }

        // 結果の表示---------------------------------------------------------------------------------
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

        // ステータス更新------------------------------------------------------------------------------
        updateStatus();

    }, ENEMY_ACTION_DELAY);
}

// 敵の行動を処理
function getRandomEnemyAction(selectedEnemyActions,enemyRMana,enemyBMana,enemyYMana) {
    const filteredActions = selectedEnemyActions.map(action => {
        // マナが足りない場合は確率を0にする
        return (enemyRMana < action.F1 || enemyBMana < action.F2 || enemyYMana < action.F3) ? { ...action, A1: 0 } : action;
    });

    // 確率の合計を再計算
    const totalProbability = filteredActions.reduce((sum, action) => sum + action.A1, 0);

    // もしすべての確率が0なら、マナ不要な行動を強制選択
    if (totalProbability === 0) {
        alert("エラー000");
        return filteredActions.find(action => action.F1 === 0 && action.F2 === 0 && action.F3 === 0) || { A0: 0, A1: 1, A: "わるあがき", B: 1, C: 0, D: 0, E1: 0, E2: 0, E3: 0, F1: 0, F2: 0, F3: 0, G: 1, H: 0 };
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
    alert("エラー001");
    return filteredActions.find(action => action.F1 === 0 && action.F2 === 0 && action.F3 === 0) || { A0: 0, A1: 1, A: "わるあがき", B: 1, C: 0, D: 0, E1: 0, E2: 0, E3: 0, F1: 0, F2: 0, F3: 0, G: 1, H: 0 };
}
import { skill } from './skilllib.js';

// プレイヤーの初期スキル
export let playerActions = {
    No1: [skill[1]],
    No2: [skill[2]],
    No3: [skill[3]],
    No4: [skill[4]],
    No5: [skill[5]],
    No6: [skill[6]],
};

export const EnemyName = {
    A: "ダブルスライム",
    B: "まほうつかい",
    C: "岩の化身"
}

// 敵図鑑
export const enemies = {
    // A0: 技ID A1:その技の発動確率  A:技の名前 B:プレイヤーに与えるダメージ  B1:プレイヤーの最大体力増減　C:敵が回復する量  C1:敵の最大体力の増減　D:敵が得るシールド
    // E:敵が得るマナ　F:その技のマナコスト　G:効果発動回数　H:プレイヤー受ダメ増加　H1:敵与ダメ増加　I: 特殊効果管理　J: 排除管理
    A: [
        { A0: 21, A1: 0.4, A: "たいあたり", B: 3, G: 1},
        { A0: 8, A1: 0.1, A: "まねっこ", G: 1, I: 1},
        { A0: 9, A1: 0.3, A: "パワーチャージ", E1: 3, G: 1},
        { A0: 6, A1: 0.2, A: "スライムショット", B: 8, E1: -3, F1: 3, G: 1, H: 1 }
    ],
    B: [
        { A0: 10, A1: 0.2, A: "シールド魔法", D: 5, E2: -2, F2: 2, G : 1 },
        { A0: 11, A1: 0.2, A: "ブリザード", B: 10, E1: -2, E3: -2, F1: 2, F3: 2, G: 1},
        { A0: 12, A1: 0.2, A: "暗黒ボール", B: 9, B1: 7 , E1: -1, E3: -3, F1: 1, F3: 3, G: 1},
        { A0: 13, A1: 0.1, A: "弱体化", E1: -1, E2: -1, E3: -1, F1: 1, F2: 1, F3: 1, G: 1, H: 2},
        { A0: 14, A1: 0.1, A: "詠唱・赤",E1: 2, G: 1},
        { A0: 15, A1: 0.1, A: "詠唱・青",E2: 2, G: 1},
        { A0: 16, A1: 0.1, A: "詠唱・黄",E3: 2, G: 1}
    ],
    C: [
        { A0: 17, A1: 0.3, A: "石のつぶて", B: 1, G: 3},
        { A0: 3,  A1: 0.2, A: "固まる", D: 2, G: 1},
        { A0: 18, A1: 0.2, A: "原石発見", E3: 2, G: 1, I: 2 },
        { A0: 19, A1: 0.2, A: "ロックスロー", B: 3 , E3: -1, F3: 1, G: 1, H1: 1},
        { A0: 20, A1: 0.1, A: "ポリッシュ", B: 3 , E3: -3, F3: 3, G: 1, H1: 1, J: 1},
    ],
};
import { applyDamage , setbar } from './utils.js';

export function Turn(PorE,MyAction,me,you,Myelim,yourelim){

    let MyMessage = ``;
    if(PorE === 0){ // PorE = 0 なら相手の行動

        MyMessage = `あいては「${MyAction.A}」を発動！`;

        }else{ // PorE = 0 以外ならプレイヤーの行動

        MyMessage = `あなたは「${MyAction.A}」を発動！`;

    }

    addLog(MyMessage);

    // 1. 行動回数の取得
    let Trigger = MyAction.G ?? 1;

    // 2. 行動回数増加処理
    if(me.Spef === 1){
        me.Spef = 0;
        for(let n = 0; n < me.Spefnum; n++){
            Trigger += 1;
        }
        me.Spefnum = 0;
    }

    // 3. 行動回数分 行動する処理
    for (let i = 0; i < Trigger; i++) {

        let MyActionT = MyAction;

        // 4. 選ばれた技に対してマナ不足かどうかを調べる
        if ((MyActionT.F1 ?? 0) > me.RMana || (MyActionT.F2 ?? 0) > me.BMana || (MyActionT.F3 ?? 0) > me.YMana) {

            if(PorE === 0){ // PorE = 0 なら相手の行動

                MyMessage = `マナが不足しているため、「${MyActionT.A}」を発動できなかった。`;
                MyActionT = { A0: 0, A1: 0.1, A: "行動不能"}; // 行動を無効にする

                }else{ // PorE = 0 以外ならプレイヤーの行動

                MyMessage = `マナが不足しているため、「${MyActionT.A}」は発動できません。`;
                MyActionT = {No: 0 , A: "行動不能", A1:"行動不能です"}; // 行動を無効にする

            }

        // 5. 選ばれた技が発動される処理
        }else{
             // 6. ダメージ処理 ( B B1 の処理 )
            if (Math.abs(MyActionT.B ?? 0) != 0){
                const result = applyDamage(you.HP, you.Sh, Math.abs(MyActionT.B ?? 0), you.Dif, me.Pow);
                you.MaxHP -= MyActionT.B1 ?? 0;

                // 7. 相手の最大体力が0以下になったとき 1 にする
                if(you.MaxHP <= 0){
                    you.MaxHP = 1;
                }

                // 8. 相手がダメージ無効化させているかを調べる
                if(you.Spef === 3){
                    you.Spef = 0;
                    you.Spefnum = 0;

                // 9. 相手にダメージが反映される処理
                }else{
                    you.HP = result.targetHP; // 相手へのダメージ
                    you.Sh = result.targetShield; //相手へのシールドダメージ

                    // 10. 相手の HPが最大HPを上回ったときの処理
                    if(you.HP>you.MaxHP){
                        you.HP = you.MaxHP;
                    }

                    // 11. ポリッシュの効果処理（要関数化）
                    if (yourelim.includes(1)) {
                        you.Pow += 1;
                    }
                }
            }
        //関数化しといて！シールドを得たとか、ダメージを与えたとか、いろいろやらんとあかんから！
        MyMessage = `発動！`;
        }

        // 12. 各行動者への影響
        me.Sh      += MyActionT.C ?? 0;  //行動者のシールド増減
        me.MaxHP   += MyActionT.C1 ?? 0; //行動者の最大HP増減
        me.HP      += MyActionT.D ?? 0; //行動者のHP増減
        you.Dif += MyActionT.H ?? 0;   //相手の受ダメ増減
        me.Pow += MyActionT.H1 ?? 0;    //行動者の与ダメ増減

        // 13. 行動者の HPが最大HPを上回ったときの処理
        if(me.HP>me.MaxHP){
            me.HP = me.MaxHP;
        }

        // 14. 行動者のマナ増減
        me.RMana += MyActionT.E1 ?? 0;
        me.BMana += MyActionT.E2 ?? 0;
        me.YMana += MyActionT.E3 ?? 0;

        // 15. 行動者の特殊効果が次のターンで発動されるための準備処理
        me.Spef = MyActionT.I ?? 0;
        me.Spefnum += MyActionT.I ?? 0;

        // 16. [排除]スキルの発動処理（実際にデッキから排除する処理が作られていない 要関数化）
        if( (MyActionT.J ?? 0) != 0 ){
            Myelim.push(MyActionT.J);
        }

        if(PorE === 0){  // PorE = 0 なら相手の行動
            setbar(you.HP,you.MaxHP,me.HP,me.MaxHP);
        }else{  //PorE = 0 以外ならプレイヤーの行動
            setbar(me.HP,me.MaxHP,you.HP,you.MaxHP);
        }

        addLog(MyMessage);
        log.innerHTML += `<br>*`;

    }
    me.Spefnum = me.Spef === 0 ? 0 : me.Spefnum / me.Spef; // 行動者の特殊効果発動回数の取得

    return {me,you};

}

function addLog(message) {
    log.innerHTML += `<br>${message}`;
    log.scrollTop = log.scrollHeight;
}
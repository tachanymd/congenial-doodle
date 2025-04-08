import { applyDamage , setbar } from './utils.js';

export function Turn(PorE,MyAction,MySpef,MySpefnum,RMyMana,BMyMana,YMyMana,YourHP,YourSh,YourDif,MyPow,MaxYourHP,YourSpef,YourSpefnum,Yourelim,MySh,MyMaxHP,MyHP,YourPow,Myelim){

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
    if(MySpef === 1){
        MySpef = 0;
        for(let n = 0; n < MySpefnum; n++){
            Trigger += 1;
        }
        MySpefnum = 0;
    }

    // 3. 行動回数分 行動する処理
    for (let i = 0; i < Trigger; i++) {

        let MyActionT = MyAction;

        // 4. 選ばれた技に対してマナ不足かどうかを調べる
        if ((MyActionT.F1 ?? 0) > RMyMana || (MyActionT.F2 ?? 0) > BMyMana || (MyActionT.F3 ?? 0) > YMyMana) {

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
                const result = applyDamage(YourHP, YourSh, Math.abs(MyActionT.B ?? 0), YourDif, MyPow);
                MaxYourHP -= MyActionT.B1 ?? 0;

                // 7. 相手の最大体力が0以下になったとき 1 にする
                if(MaxYourHP <= 0){
                    MaxYourHP = 1;
                }

                // 8. 相手がダメージ無効化させているかを調べる
                if(YourSpef === 3){
                    YourSpef = 0;
                    YourSpefnum = 0;

                // 9. 相手にダメージが反映される処理
                }else{
                    YourHP = result.targetHP; // 相手へのダメージ
                    YourSh = result.targetShield; //相手へのシールドダメージ

                    // 10. 相手の HPが最大HPを上回ったときの処理
                    if(YourHP>MaxYourHP){
                        YourHP = MaxYourHP;
                    }

                    // 11. ポリッシュの効果処理（要関数化）
                    if (Yourelim.includes(1)) {
                        YourPow += 1;
                    }
                }
            }
        //関数化しといて！シールドを得たとか、ダメージを与えたとか、いろいろやらんとあかんから！
        MyMessage = `発動！`;
        }

        // 12. 各行動者への影響
        MySh      += MyActionT.C ?? 0;  //行動者のシールド増減
        MyMaxHP   += MyActionT.C1 ?? 0; //行動者の最大HP増減
        MyHP      += MyActionT.D ?? 0; //行動者のHP増減
        YourDif += MyActionT.H ?? 0;   //相手の受ダメ増減
        MyPow += MyActionT.H1 ?? 0;    //行動者の与ダメ増減

        // 13. 行動者の HPが最大HPを上回ったときの処理
        if(MyHP>MyMaxHP){
            MyHP = MyMaxHP;
        }

        // 14. 行動者のマナ増減
        RMyMana += MyActionT.E1 ?? 0;
        BMyMana += MyActionT.E2 ?? 0;
        YMyMana += MyActionT.E3 ?? 0;

        // 15. 行動者の特殊効果が次のターンで発動されるための準備処理
        MySpef = MyActionT.I ?? 0;
        MySpefnum += MyActionT.I ?? 0;

        // 16. [排除]スキルの発動処理（実際にデッキから排除する処理が作られていない 要関数化）
        if( (MyActionT.J ?? 0) != 0 ){
            Myelim.push(MyActionT.J);
        }

        if(PorE === 0){  // PorE = 0 なら相手の行動
            setbar(YourHP,MaxYourHP,MyHP,MyMaxHP);
        }else{  //PorE = 0 以外ならプレイヤーの行動
            setbar(MyHP,MyMaxHP,YourHP,MaxYourHP);
        }

        addLog(MyMessage);
        log.innerHTML += `<br>*`;

    }
    MySpefnum = MySpef === 0 ? 0 : MySpefnum / MySpef; // 行動者の特殊効果発動回数の取得

    return {MySpef,MySpefnum,RMyMana,BMyMana,YMyMana,YourHP,YourSh,YourDif,MyPow,MaxYourHP,YourSpef,YourSpefnum,Yourelim,MySh,MyMaxHP,MyHP,YourPow,Myelim};

}

function addLog(message) {
    log.innerHTML += `<br>${message}`;
    log.scrollTop = log.scrollHeight;
}
// 要素からランダムに指定された数抽出
export function getRandom(array, num, type) {
    const Names = Object.keys(array);
    const shuffled = Names.sort(() => 0.5 - Math.random());

    if (type === 0) {
        return shuffled.slice(0, num).map(name => array[name][0]);
    } else {
        return shuffled.slice(0, num).map(name => ({ name, actions: array[name] }));
    }
}

// ダメージ換算処理
export function applyDamage(targetHP, targetShield, damage, Diff, Power) {
    if (targetShield > 0) {
        const damageToShield = Math.min(damage + Diff + Power, targetShield);
        targetShield -= damageToShield;
        targetHP -= (damage + Diff + Power - damageToShield);
    } else {
        targetHP -= (damage + Diff + Power);
    }
    return { targetHP, targetShield };
}

// 各idのdisplay管理
export function toggleDisplay(elementId, displayValue) {
    document.getElementById(elementId).style.display = displayValue;
}

// 各クラスのdisplay管理
export function toggleClassDisplay(elementId, displayValue) {
    document.querySelector(elementId).style.display = displayValue;
}

// 各クラスの内容リセット
export function reset(elementId) {
    document.getElementById(elementId).innerHTML = '';
}

export function Reset(className) {
    const elements = document.querySelectorAll(`.${className}`);
    elements.forEach(el => el.innerHTML = '');
}

function setHP(percentage) {
    const hpBar = document.getElementById("hp-bar");
    hpBar.style.width = percentage + "%";

    // HPが少なくなると色を変える
    if (percentage > 50) {
        hpBar.style.backgroundColor = "limegreen";
    } else if (percentage > 20) {
        hpBar.style.backgroundColor = "yellow";
    } else {
        hpBar.style.backgroundColor = "red";
    }
}

function EsetHP(percentage) {
    const EhpBar = document.getElementById("Ehp-bar");
    EhpBar.style.width = percentage + "%";

    // HPが少なくなると色を変える
    if (percentage > 50) {
        EhpBar.style.backgroundColor = "limegreen";
    } else if (percentage > 20) {
        EhpBar.style.backgroundColor = "yellow";
    } else {
        EhpBar.style.backgroundColor = "red";
    }
}

export function setbar(hp,maxhp,ehp,maxehp){
    if (hp < 0) hp = 0;
    setHP((hp / maxhp) * 100);

    if (ehp < 0) ehp = 0;
    EsetHP((ehp / maxehp) * 100);
}

export function EnemyBlock(EnemyName){
    document.querySelector(".ECharacter-wrapper").innerHTML = `<img src="./gif/enemy/${EnemyName}.gif" alt="敵" id="EC">`;
}
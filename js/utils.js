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
export function applyDamage(targetHP, targetShield, damage, Trigger, Diff) {
    for (let i = 0; i < Trigger; i++) {
        if (targetShield > 0) {
            const damageToShield = Math.min(damage + Diff, targetShield);
            targetShield -= damageToShield;
            targetHP -= (damage + Diff - damageToShield);
        } else {
            targetHP -= damage + Diff;
        }
    }
    return { targetHP, targetShield };
}

// 各クラスのdisplay管理
export function toggleDisplay(elementId, displayValue) {
    document.getElementById(elementId).style.display = displayValue;
}

// 各クラスの内容リセット
export function reset(elementId) {
    document.getElementById(elementId).innerHTML = '';
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
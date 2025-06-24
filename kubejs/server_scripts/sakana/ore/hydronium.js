// ==========================================
// Hydroniumシステム フル実装 (KubeJS v6用)
// ==========================================

StartupEvents.registry('item', event => {

    // Hydronium Creator
    event.create('hydronium_creator')
        .displayName('Hydronium Creator')
        .texture('kubejs:item/hydronium_creator')
        .unstackable();

    // Hydronium Ingot
    event.create('hydronium_ingot')
        .displayName('Hydronium Ingot')
        .texture('kubejs:item/hydronium_ingot');

    // 水グレートブレード（武器として登録・攻撃力と速度もレジストリ設定）
    event.create('hydronium_great_blade')
        .displayName('水グレートブレード')
        .texture('kubejs:item/hydronium_great_blade')
        .unstackable()
        .maxDamage(700)
        .attackDamageBaseline(9.0) // 攻撃力9
        .attackSpeedBaseline(1.0)  // 攻撃速度1.0
        .tag('minecraft:swords')
        .tag('forge:weapons');

    // 資源クリエイター
    event.create('sigen_creator')
        .displayName('資源クリエイター')
        .texture('kubejs:item/sigen_creator')
        .unstackable();
});

// ==========================================
// プレイヤースポーン時のHydronium Creator配布
// ==========================================
PlayerEvents.loggedIn(event => {
    if (!event.player.stages.has('got_hydronium_creator')) {
        event.player.give('kubejs:hydronium_creator');
        event.player.stages.add('got_hydronium_creator');
    }
});

// ==========================================
// Hydronium Creatorの使用処理（9分ごとにIngot生成）
// ==========================================
ItemEvents.rightClicked('kubejs:hydronium_creator', event => {
    if (event.hand != 'MAIN_HAND') return;

    if (event.player.persistentData.hydroniumNext == undefined) {
        event.player.persistentData.hydroniumNext = event.player.level.getGameTime() + (9 * 60 * 20);
    }

    const time = event.player.level.getGameTime();

    if (time >= event.player.persistentData.hydroniumNext) {
        event.player.give('kubejs:hydronium_ingot');
        event.player.persistentData.hydroniumNext = time + (9 * 60 * 20);
        event.player.tell('§bHydroniumが生成されました！');
    } else {
        const remain = Math.ceil((event.player.persistentData.hydroniumNext - time) / 20);
        event.player.tell('あと§e' + remain + '秒§rで生成できます。');
    }
});

// ==========================================
// 水グレートブレードの範囲攻撃・溺死効果
// ==========================================
PlayerEvents.attack(event => {
    if (event.item.id == 'kubejs:hydronium_great_blade') {
        const radius = 3;
        const pos = event.target.blockPosition();

        event.level.getEntitiesWithin(AABB.of(pos.offset(-radius, -radius, -radius), pos.offset(radius, radius, radius))).forEach(entity => {
            if (entity != event.player && entity.isLiving() && entity.distanceTo(event.player) <= radius) {
                entity.hurt(2.0, event.player); // 追加ダメージ
                entity.addEffect('minecraft:water_breathing', 100, 0);
                entity.addEffect('minecraft:slowness', 100, 1);
            }
        });
    }
});

// ==========================================
// 水グレートブレードのクラフトレシピ
// ==========================================
ServerEvents.recipes(event => {
    event.shaped('kubejs:hydronium_great_blade', [
        ' II',
        ' I ',
        ' S '
    ], {
        I: 'kubejs:hydronium_ingot',
        S: 'minecraft:stick'
    });
});

// ==========================================
// 資源クリエイターの使用処理（鉱石生成）
// ==========================================
ItemEvents.rightClicked('kubejs:sigen_creator', event => {
    if (event.hand != 'MAIN_HAND') return;

    if (!event.player.inventory.contains('kubejs:hydronium_ingot')) {
        event.player.tell('Hydronium Ingotが必要です。');
        return;
    }

    event.player.inventory.remove('kubejs:hydronium_ingot', 1);

    const pos = event.player.blockPosition();

    const ores = [
        { id: 'minecraft:diamond_ore', chance: 5 },
        { id: 'minecraft:emerald_ore', chance: 5 },
        { id: 'minecraft:quartz_ore', chance: 15 },
        { id: 'minecraft:iron_ore', chance: 25 },
        { id: 'minecraft:coal_ore', chance: 50 }
    ];

    for (let x = -2; x <= 2; x++) {
        for (let y = -1; y <= 1; y++) {
            for (let z = -2; z <= 2; z++) {
                if (Math.random() < 0.2) { // 20%の確率で生成
                    const target = pos.offset(x, y, z);
                    const roll = Math.random() * 100;
                    let cumulative = 0;

                    for (const ore of ores) {
                        cumulative += ore.chance;
                        if (roll <= cumulative) {
                            event.level.setBlock(target, ore.id);
                            break;
                        }
                    }
                }
            }
        }
    }

    event.player.tell('周囲に鉱石が生成されました！');
});

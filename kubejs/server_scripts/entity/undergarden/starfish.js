// モブエンティティの登録
onEvent('entity.registry', e => {
    e.create('custom:starfish') // カスタムエンティティの登録
        .entityType('minecraft:zombie') // ベースのエンティティをゾンビに設定
        .id('custom:starfish') // ヒトデのID
        .model('custom:starfish_model') // 作成したモデルを指定
        .texture('custom:starfish_texture') // 作成したテクスチャを指定
        .properties(p => p
            .health(40)  // ヒトデのHP
            .damage(5.5)  // ヒトデのダメージ
            .attackSpeed(1)  // ヒトデの攻撃速度
        )
        .lootTable('custom:starfish_loot');  // ドロップアイテムを設定
});

// モブのスポーン設定（Undergardenディメンションにスポーン）
onEvent('entity.spawn', e => {
    e.addEntity('custom:starfish', (spawn) => {
        spawn
            .dimensions('undergarden:undergarden') // Undergardenディメンションでスポーン
            .weight(10) // スポーン確率（重さ）
            .spawnCount(1) // 一度にスポーンする個体数
            .spawnConditions((condition) => {
                condition.addCondition('minecraft:surfaces', 'minecraft:grass'); // 地面条件（例: 草の上）
            });
    });
});

// ヒトデのドロップアイテム設定（Utherium Shard）
onEvent('loot_tables', e => {
    e.add('custom:starfish_loot', loot => {
        loot.addPool(pool => {
            pool.addItem('undergarden:utherium_shard', 1, 1); // utherium_shardをドロップ
        });
    });
});

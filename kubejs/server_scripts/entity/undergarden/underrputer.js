// エンティティ登録
StartupEvents.registry('entity_type', event => {
  event.create('underrupter')
    .category('monster')
    .dimensions(['undergarden:undergarden'])
    .trackingRange(64)
    .updateInterval(2)
    .clientTrackingRange(10)
    .spawn((level, x, y, z) => {
      return level.createEntity('kubejs:underrupter').setPosition(x, y, z)
    })
})

// ステータスと毒効果
EntityEvents.spawned(event => {
  if (event.entity.type == 'kubejs:underrupter') {
    event.entity.maxHealth = 30
    event.entity.health = 30
    event.entity.attackDamage = 4.5
    event.entity.attackSpeed = 1
  }
})

MobEvents.attack(event => {
  if (event.source.entity?.type == 'kubejs:underrupter') {
    event.entity.addEffect('minecraft:poison', 100, 2) // 毒III 5秒
  }
})

// スポーンルール（Undergarden）
SpawnEvents.addSpawn(spawn => {
  spawn.entity('kubejs:underrupter')
  spawn.biomes('#undergarden:is_undergarden') // タグまたは直接バイオーム指定
  spawn.chance(10)
  spawn.minCount(1).maxCount(2)
})

// ドロップ：utherium_shard（25%）
LootJS.modifiers(event => {
  event.addEntityLoot('kubejs:underrupter', table => {
    table.addItem('undergarden:utherium_shard').chance(0.25)
  })
})

// 1tickごとに氷の上に立っているプレイヤーを判定し、65536分の1で召喚
ServerEvents.tick(event => {
  const players = event.server.players
  players.forEach(player => {
    const below = player.level.getBlock(player.blockX, player.blockY - 1, player.blockZ).id

    if (
      below == 'minecraft:ice' ||
      below == 'minecraft:packed_ice' ||
      below == 'minecraft:blue_ice'
    ) {
      if (Math.random() < 1 / 65536) {
        const pos = player.position()
        const look = player.getViewVector().normalize()
        player.server.runCommandSilent(
          `summon lycanitesmobs:serpix ${pos.x + look.x * 1.5} ${pos.y + 1} ${pos.z + look.z * 1.5} ` +
          `{Tags:["crystaah"],CustomName:'"Crystaah"',Health:80.0}`
        )
        player.tell("冷気をまとったCrystaahが出現！")
      }
    }
  })
})

// Crystaahの遠距離攻撃（正面にblizzardchargeを複数発射）
EntityEvents.hurt(event => {
  const entity = event.entity
  if (!entity.tags.contains('crystaah')) return
  if (event.source.type != 'player') return

  const level = entity.level
  const pos = entity.position()
  const look = entity.getViewVector().normalize()

  for (let i = -2; i <= 2; i++) {
    const offsetX = look.x + (Math.random() - 0.5) * 0.5
    const offsetZ = look.z + (Math.random() - 0.5) * 0.5

    level.server.runCommandSilent(
      `summon lycanitesmobs:blizzardcharge ${pos.x + offsetX} ${pos.y + 1} ${pos.z + offsetZ} ` +
      `{ownerUUID:"${entity.uuid}",damage:2.0,velocity:0.65f}`
    )
  }
})

// Crystaahのドロップ設定（死亡時）
EntityEvents.death(event => {
  const entity = event.entity
  if (!entity.tags.contains('crystaah')) return
  const pos = entity.position()
  const level = entity.level

  const drops = [
    { id: 'minecraft:diamond', min: 1, max: 2, chance: 0.5 },
    { id: 'minecraft:emerald', min: 1, max: 3, chance: 0.65 },
    { id: 'minecraft:quartz', min: 2, max: 5, chance: 0.9 },
    { id: 'minecraft:ice', min: 4, max: 8, chance: 0.95 },
    { id: 'minecraft:blue_ice', min: 1, max: 2, chance: 0.7 }
  ]

  drops.forEach(drop => {
    if (Math.random() < drop.chance) {
      const amount = Math.floor(Math.random() * (drop.max - drop.min + 1)) + drop.min
      level.server.runCommandSilent(`summon item ${pos.x} ${pos.y} ${pos.z} {Item:{id:"${drop.id}",Count:${amount}b}}`)
    }
  })
})

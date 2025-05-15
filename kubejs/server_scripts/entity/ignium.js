let summonedIgniums = []

ServerEvents.tick(event => {
  const server = event.server
  const world = server.levels.get("minecraft:the_nether")
  if (!world) return

  world.getPlayers().forEach(player => {
    const pos = player.blockPosition()
    const base = pos.below(1)

    const isValidStructure =
      world.getBlockState(pos).id === "minecraft:magma_block" &&
      world.getBlockState(base).id === "minecraft:obsidian" &&
      world.getBlockState(base.below(1)).id === "minecraft:obsidian" &&
      world.getBlockState(base.below(2)).id === "minecraft:obsidian"

    if (isValidStructure) {
      // 壊す
      world.setBlock(pos, "minecraft:air")
      world.setBlock(base, "minecraft:air")
      world.setBlock(base.below(1), "minecraft:air")
      world.setBlock(base.below(2), "minecraft:air")

      // 演出
      server.runCommandSilent(`particle flame ${pos.x + 0.5} ${pos.y + 1} ${pos.z + 0.5} 0.5 1 0.5 0.01 100 force`)
      server.runCommandSilent(`playsound minecraft:entity.wither.spawn master @a ${pos.x} ${pos.y} ${pos.z} 1 1`)
      server.runCommandSilent(`title @a subtitle {"text":"炎の王、Igniumが現れた！","color":"red","bold":true}`)

      // Cinder召喚→Ignium化
      const entity = world.spawnEntity("lycanitesmobs:cinder", pos.x + 0.5, pos.y + 1, pos.z + 0.5)
      if (entity != null) {
        entity.customName = Text.of("Ignium").red().bold()
        entity.persistent = true
        entity.setMaxHealth(900)
        entity.health = 900
        entity.getTags().add("ignium")
        entity.setArmorValue(12)
        entity.setOnFire(99999)
        summonedIgniums.push(entity)
      }
    }
  })

  // Igniumの弾幕攻撃
  summonedIgniums = summonedIgniums.filter(ignium => {
    if (!ignium.isAlive()) return false

    if (Math.random() < 0.2) {
      const pos = ignium.position
      const yaw = Math.random() * 360
      const pitch = -10 + Math.random() * 20
      const speed = 1.5 + Math.random() * 0.5

      const radYaw = yaw * (Math.PI / 180)
      const radPitch = pitch * (Math.PI / 180)

      const dx = -Math.sin(radYaw) * Math.cos(radPitch)
      const dy = Math.sin(radPitch)
      const dz = Math.cos(radYaw) * Math.cos(radPitch)

      const projectile = ignium.level.spawnEntity("lycanitesmobs:embercharge", pos.x, pos.y + 1.2, pos.z)
      if (projectile != null) {
        projectile.setDeltaMovement(dx * speed, dy * speed, dz * speed)
        projectile.owner = ignium
        projectile.setDamage(2)  // 玉のダメージ設定（2ダメージ）
      }
    }
    return true
  })
})

// Ignium死亡時に確率付きドロップ（個数も設定）
EntityEvents.death(event => {
  const entity = event.entity
  if (!entity.getTags().contains("ignium")) return

  const pos = entity.blockPosition()
  const level = entity.level

  // ドロップアイテム、確率、個数の設定
  const dropItems = [
    { id: "minecraft:netherite_ingot", chance: 0.5, minAmount: 1, maxAmount: 2 },  // 50%で1〜2個
    { id: "minecraft:blaze_rod", chance: 0.6, minAmount: 2, maxAmount: 4 },         // 60%で2〜4個
    { id: "minecraft:enchanted_golden_apple", chance: 0.3, minAmount: 1, maxAmount: 1 },  // 30%で1個
    { id: "minecraft:diamond_block", chance: 0.7, minAmount: 1, maxAmount: 1 },    // 70%で1個
    { id: "minecraft:totem_of_undying", chance: 0.5, minAmount: 1, maxAmount: 1 }, // 50%で1個
    { id: "minecraft:fire_charge", chance: 0.8, minAmount: 3, maxAmount: 6 }        // 80%で3〜6個
  ]

  // 確率と個数に基づいてアイテムをドロップ
  dropItems.forEach(item => {
    if (Math.random() < item.chance) {
      const amount = Math.floor(Math.random() * (item.maxAmount - item.minAmount + 1)) + item.minAmount
      for (let i = 0; i < amount; i++) {
        level.spawnItem(item.id, pos.x + 0.5, pos.y + 1, pos.z + 0.5)
      }
    }
  })

  // ドロップ演出
  level.server.runCommandSilent(`title @a subtitle {"text":"Igniumを討伐した！","color":"gold","bold":true}`)
  level.server.runCommandSilent(`playsound minecraft:ui.toast.challenge_complete master @a ${pos.x} ${pos.y} ${pos.z} 1 1`)
})

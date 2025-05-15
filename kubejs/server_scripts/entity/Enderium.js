let summonedEnderiums = []

ServerEvents.tick(event => {
  const server = event.server
  const world = server.levels.get("minecraft:the_end")
  if (!world) return

  world.getPlayers().forEach(player => {
    const pos = player.blockPosition()
    const base = pos.below(1)

    const isValidStructure =
      world.getBlockState(pos).id === "minecraft:purpur_block" &&
      world.getBlockState(base).id === "minecraft:end_stone_bricks" &&
      world.getBlockState(base.below(1)).id === "minecraft:end_stone_bricks"

    if (isValidStructure) {
      // 壊す
      world.setBlock(pos, "minecraft:air")
      world.setBlock(base, "minecraft:air")
      world.setBlock(base.below(1), "minecraft:air")

      // 演出
      server.runCommandSilent(`particle end_rod ${pos.x + 0.5} ${pos.y + 1} ${pos.z + 0.5} 0.5 1 0.5 0.01 100 force`)
      server.runCommandSilent(`playsound minecraft:entity.ender_dragon.growl master @a ${pos.x} ${pos.y} ${pos.z} 1 1`)
      server.runCommandSilent(`title @a subtitle {"text":"空間が歪む… Enderiumが降臨！","color":"light_purple","bold":true}`)

      // Spectre → Enderium変化
      const entity = world.spawnEntity("lycanitesmobs:spectre", pos.x + 0.5, pos.y + 1, pos.z + 0.5)
      if (entity != null) {
        entity.customName = Text.of("Enderium").lightPurple().bold()
        entity.persistent = true
        entity.setMaxHealth(900)
        entity.health = 900
        entity.getTags().add("enderium")
        entity.setArmorValue(10)
        summonedEnderiums.push({ entity: entity, tick: 0 })
      }
    }
  })

  // Enderiumアクション（弾幕 + 手下召喚）
  summonedEnderiums = summonedEnderiums.filter(obj => {
    const enderium = obj.entity
    if (!enderium.isAlive()) return false

    obj.tick++

    // 弾幕攻撃
    if (Math.random() < 0.3) {
      const pos = enderium.position
      const yaw = Math.random() * 360
      const pitch = -10 + Math.random() * 20
      const speed = 10.0

      const radYaw = yaw * (Math.PI / 180)
      const radPitch = pitch * (Math.PI / 180)

      const dx = -Math.sin(radYaw) * Math.cos(radPitch)
      const dy = Math.sin(radPitch)
      const dz = Math.cos(radYaw) * Math.cos(radPitch)

      const proj = enderium.level.spawnEntity("lycanitesmobs:spectralboltcharge", pos.x, pos.y + 1.2, pos.z)
      if (proj != null) {
        proj.setDeltaMovement(dx * speed, dy * speed, dz * speed)
        proj.owner = enderium
        proj.setDamage(1)
      }
    }

    // 手下召喚（40tickごとに最大3体）
    if (obj.tick % 40 === 0) {
      for (let i = 0; i < 3; i++) {
        const x = enderium.x + (Math.random() - 0.5) * 5
        const y = enderium.y + 1
        const z = enderium.z + (Math.random() - 0.5) * 5
        const minion = enderium.level.spawnEntity("lycanitesmobs:spectre", x, y, z)
        if (minion != null) {
          minion.getTags().add("enderium_minion")
          minion.customName = Text.of("Enderiumの手下").gray()
        }
      }
    }

    return true
  })
})

// Enderium死亡時のドロップ
EntityEvents.death(event => {
  const entity = event.entity
  if (!entity.getTags().contains("enderium")) return

  const pos = entity.blockPosition()
  const level = entity.level

  const drops = [
    { id: "minecraft:ender_pearl", chance: 0.95, min: 4, max: 8 },
    { id: "minecraft:chorus_fruit", chance: 0.9, min: 3, max: 6 },
    { id: "minecraft:shulker_shell", chance: 0.7, min: 1, max: 2 },
    { id: "minecraft:dragon_breath", chance: 0.6, min: 1, max: 1 },
    { id: "minecraft:elytra", chance: 0.5, min: 1, max: 1 }
  ]

  drops.forEach(drop => {
    if (Math.random() < drop.chance) {
      const amount = Math.floor(Math.random() * (drop.max - drop.min + 1)) + drop.min
      for (let i = 0; i < amount; i++) {
        level.spawnItem(drop.id, pos.x + 0.5, pos.y + 1, pos.z + 0.5)
      }
    }
  })

  level.server.runCommandSilent(`title @a subtitle {"text":"Enderiumを撃破！","color":"aqua","bold":true}`)
  level.server.runCommandSilent(`playsound minecraft:entity.experience_orb.pickup master @a ${pos.x} ${pos.y} ${pos.z} 1 1`)
})

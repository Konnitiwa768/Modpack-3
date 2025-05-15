// Taigar召喚：トウヒの原木を壊すと1%で出現
BlockEvents.broken(event => {
  if (event.block.id === 'minecraft:spruce_log' && Math.random() < 0.01) {
    const { x, y, z, server } = event.block
    const taigar = server.runCommandSilent(`summon lycanitesmobs:reiver ${x} ${y + 1} ${z} {CustomName:'"Taigar"',Tags:["taigar_boss"],Health:30.0}`)

    event.server.scheduleInTicks(20, () => {
      let target = event.player
      if (target) {
        taigar.setAttackTarget(target)
      }
    })
  }
})

// Taigar能力設定・遠距離攻撃・囲む技
EntityEvents.spawned(event => {
  if (!event.entity || !event.entity.hasTag('taigar_boss')) return

  const taigar = event.entity

  // ステータス設定
  taigar.getAttribute('minecraft:generic.max_health').baseValue = 30
  taigar.health = 30
  taigar.getAttribute('minecraft:generic.attack_damage').baseValue = 5
  taigar.getAttribute('minecraft:generic.attack_speed').baseValue = 1

  // 定期的に4方向にfrostboltcharge（氷弾）を発射（0.4秒に1回）
  event.server.scheduleRepeatingInTicks(8, e => {
    if (!taigar.isAlive()) {
      e.cancel()
      return
    }

    const dirs = [
      [1, 0], [-1, 0], [0, 1], [0, -1]
    ]

    dirs.forEach(dir => {
      taigar.level.server.runCommandSilent(
        `summon lycanitesmobs:frostboltcharge ${taigar.x + dir[0]} ${taigar.y + 1} ${taigar.z + dir[1]} {ownerUUID:"${taigar.uuid}",damage:2.0,Tags:["taigar_bullet"]}`
      )
    })
  })

  // プレイヤーをトウヒの丸太で囲む（20秒ごと）
  event.server.scheduleRepeatingInTicks(400, e => {
    if (!taigar.isAlive()) {
      e.cancel()
      return
    }

    const target = taigar.getAttackTarget()
    if (target) {
      const { x, y, z } = target.blockPosition()

      const positions = [
        [x + 1, y, z], [x - 1, y, z],
        [x, y, z + 1], [x, y, z - 1],
        [x + 1, y, z + 1], [x - 1, y, z - 1],
        [x + 1, y, z - 1], [x - 1, y, z + 1]
      ]

      positions.forEach(pos => {
        taigar.level.setBlock(pos[0], pos[1], pos[2], 'minecraft:spruce_log')
      })
    }
  })
})

// Taigarのドロップ設定
EntityEvents.death(event => {
  const entity = event.entity
  const level = entity.level

  if (!entity.hasTag('taigar_boss')) return

  const { x, y, z } = entity.blockPosition()

  function drop(itemId, min, max, chance) {
    if (Math.random() < chance) {
      const amount = Math.floor(Math.random() * (max - min + 1)) + min
      level.server.runCommandSilent(`summon item ${x} ${y} ${z} {Item:{id:"${itemId}",Count:${amount}b}}`)
    }
  }

  // 適度に豪華なドロップ
  drop("minecraft:spruce_sapling", 1, 3, 0.8)    // 苗木（80%）
  drop("minecraft:ice", 1, 2, 0.6)                // 氷（60%）
  drop("minecraft:snowball", 2, 4, 0.95)          // 雪玉（95%）
  drop("minecraft:stick", 1, 1, 0.3)              // トウヒの棒（30%）
})

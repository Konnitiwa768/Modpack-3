const fishTypes = ['salmon', 'cod', 'tropical_fish', 'pufferfish']

ServerEvents.playerLoggedIn(event => {
  const player = event.player

  if (!player.persistentData.fishType) {
    const chosenFish = fishTypes[Math.floor(Math.random() * fishTypes.length)]
    player.persistentData.fishType = chosenFish

    player.give(Item.of('minecraft:water_bucket', 5))
    player.tell(`あなたは魚クラフトの世界へようこそ。魚の種類は「${chosenFish}」に決まりました。`)
  }

  const fishType = player.persistentData.fishType

  // 魚が既にいるか確認し、なければ召喚
  const fish = player.world.getEntities().find(e => e.getType() === `minecraft:${fishType}` && e.getTags().contains('fish_host') && e.getPos().distanceTo(player.getPos()) < 10)

  if (!fish) {
    player.server.runCommandSilent(`summon minecraft:${fishType} ${player.x} ${player.y} ${player.z} {Tags:["fish_host"],NoAI:1b,Invulnerable:1b,Silent:1b}`)
  }

  // プレイヤーを透明化（長時間）
  player.runCommandSilent(`effect give @s minecraft:invisibility 1000000 0 true`)
})

ServerEvents.tick(event => {
  event.server.players.forEach(player => {
    if (!player.persistentData.fishType) return

    // 魚を取得
    const fishType = player.persistentData.fishType
    const fish = player.world.getEntities().find(e => e.getType() === `minecraft:${fishType}` && e.getTags().contains('fish_host'))

    if (fish) {
      // 魚をプレイヤーにTP（追従）
      fish.setPosition(player.x, player.y, player.z)
    } else {
      // 魚がいない場合は召喚し直す
      player.server.runCommandSilent(`summon minecraft:${fishType} ${player.x} ${player.y} ${player.z} {Tags:["fish_host"],NoAI:1b,Invulnerable:1b,Silent:1b}`)
    }

    // 酸欠ダメージ処理
    const isWet = player.isInWater() || player.isRaining()
    if (!isWet && player.tickCount % 20 === 0) {
      player.attack(0.3, 'suffocation')
    }
  })
})

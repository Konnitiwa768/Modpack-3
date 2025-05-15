const fishTypes = ['salmon', 'cod', 'tropical_fish', 'pufferfish']

// ログイン時に魚種決定＆見た目変更＆バケツ支給
ServerEvents.playerLoggedIn(event => {
  const player = event.player
  if (!player.persistentData.fishType) {
    // ランダムに魚種を選択
    const chosenFish = fishTypes[Math.floor(Math.random() * fishTypes.length)]
    player.persistentData.fishType = chosenFish

    // 水バケツ5個配布
    player.give(Item.of('minecraft:water_bucket', 5))

    player.tell(`あなたは魚クラフトの世界へようこそ。魚の種類は「${chosenFish}」に決まりました。`)
  }

  // 見た目を魚に変える（Identity Modのdisguiseコマンド使用）
  const fishType = player.persistentData.fishType
  player.runCommandSilent(`/disguise minecraft:${fishType}`)
})

// 酸欠ダメージ処理
ServerEvents.tick(event => {
  event.server.players.forEach(player => {
    if (!player.persistentData.fishType) return
    // 水中・雨中以外でダメージ
    if (!player.isInWater() && !player.isRaining()) {
      if (player.tickCount % 20 === 0) { // 1秒毎
        player.attack(0.3, 'suffocation') // First Aid対応ダメージ
      }
    }
  })
})

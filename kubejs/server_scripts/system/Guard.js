PlayerEvents.hurt(event => {
  const player = event.player
  const heldItem = player.mainHandItem

  // 剣を持っていて、右クリック中（ブロッキング状態）の場合
  if (heldItem.is('minecraft:sword') && player.isUsingItem()) {
    event.damage = event.damage * 0.4  // 60%カット
    heldItem.damage(1, player)
    player.sendMessage("ガード成功！剣の耐久が1減った。")
    
    // コンボキャンセルロジック（例：攻撃者のコンボ状態解除）
    const attacker = event.source.entity
    if (attacker) attacker.persistentData.remove("comboCount")
  }
})

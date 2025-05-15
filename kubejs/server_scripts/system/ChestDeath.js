EntityEvents.die(event => {
  const player = event.entity
  const level = event.level
  const position = player.blockPosition()

  // チェストの位置を決める（死亡地点に1マス上にチェストを生成）
  const chestPos = position.offset(0, 1, 0)

  // チェストを生成
  level.setBlock(chestPos, 'minecraft:chest')

  // チェストを開けるための参照を取得
  const chest = level.getBlockEntity(chestPos)

  // プレイヤーのインベントリアイテムをチェストに移動
  player.inventory.items.forEach(itemStack => {
    if (itemStack.isEmpty()) return
    chest.addItem(itemStack)
    player.inventory.removeItem(itemStack) // アイテムをインベントリから削除
  })

  // 死亡メッセージを表示
  player.sendMessage("あなたのアイテムはチェストに保存されました！よかったですね！")
})

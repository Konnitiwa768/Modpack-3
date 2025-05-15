ItemEvents.rightClicked(event => {
  const player = event.player
  const item = event.item

  // シフトキーが押されている場合のみ
  if (event.isShiftDown() && item.id === 'kubejs:portable_crafting_table') {
    // プレイヤーに作業台のGUIを表示
    player.openScreen('minecraft:crafting_table')
  }
})

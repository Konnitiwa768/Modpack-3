ItemEvents.rightClicked(event => {
  const player = event.player
  if (event.item.id === 'kubejs:auto_pickup') {
    player.addEventListener('tick', (e) => {
      // 周囲10ブロック以内のアイテムを拾う
      const nearbyItems = e.level.getEntities(player.blockPosition, 10).filter(entity => entity instanceof ItemEntity)
      nearbyItems.forEach(itemEntity => {
        if (player.inventory.canAdd(itemEntity.item)) {
          player.inventory.addItem(itemEntity.item)
          itemEntity.remove() // アイテムを削除
        }
      })
    })
  }
})

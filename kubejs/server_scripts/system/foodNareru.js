const foodData = new Map()

ItemEvents.foodEaten(event => {
  const player = event.player
  const itemId = event.item.id

  // プレイヤーごとの食事履歴を取得
  let data = foodData.get(player.uuid) || {}

  if (!data[itemId]) {
    data[itemId] = { count: 0, threshold: Math.floor(50 + Math.random() * 50) }
  }

  data[itemId].count++

  // 効果低下条件
  if (data[itemId].count >= data[itemId].threshold) {
    player.sendMessage(`§7${itemId}は食べすぎて効果が落ちているようだ…`)
    // 満腹効果をキャンセルまたは弱体化（ここでは例示）
    player.hungerManager.add(-2, 0) // 飽きによる空腹減少
  }

  // 他の食べ物を食べたら回復（ちょっとずつ）
  Object.keys(data).forEach(key => {
    if (key !== itemId && data[key].count > 0) {
      data[key].count -= 2
      if (data[key].count < 0) data[key].count = 0
    }
  })

  foodData.set(player.uuid, data)
})

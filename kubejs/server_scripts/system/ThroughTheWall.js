EntityEvents.tick(event => {
  const entity = event.entity
  if (!entity.isMonster) return

  const target = entity.target
  if (!target) return

  const dist = entity.position.distanceTo(target.position)

  // 距離が近いけどブロックに阻まれてる
  if (dist < 4 && !entity.canSee(target)) {
    const blockPos = entity.blockPosition().offset(entity.facing) // 前方のブロック
    const block = event.level.getBlock(blockPos)
    if (!block.isAir() && block.hardness <= 3600001) {
      // ランダムに破壊開始（例：20%）
      if (Math.random() < 0.2) {
        event.level.breakBlock(blockPos, true)
      }
    }
  }
})

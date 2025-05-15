// ファイル: kubejs/server_scripts/system/sneak_grow.js

PlayerEvents.tick(event => {
  const player = event.player

  // 毎tickでしゃがみ状態をチェック
  if (player.isSneaking()) {
    const block = player.level.getBlock(player.blockPosition.below())

    // 成長可能な作物かどうかを確認
    if (block.hasProperty("age") && block.getValue("age") < block.getMaxValue("age")) {
      // 10%の確率で1段階成長（連打防止）
      if (Math.random() < 0.1) {
        block.setValue("age", block.getValue("age") + 1)
      }
    }
  }
})

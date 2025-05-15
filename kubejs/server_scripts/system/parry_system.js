// ファイル: kubejs/server_scripts/system/parry_system.js

// プレイヤーの最終しゃがみ開始時間を記録
const parryMap = new Map()

PlayerEvents.tick(event => {
  const player = event.player
  if (player.isSneaking()) {
    parryMap.set(player.uuid, event.level.time)
  }
})

// 攻撃イベントでパリィ判定
EntityEvents.hurt(event => {
  const attacker = event.source.entity
  const target = event.entity

  if (!attacker || !target || attacker == target) return

  const uuid = attacker.uuid

  // 対象がプレイヤーならパリィチャンス
  if (target.isPlayer()) {
    const lastSneak = parryMap.get(target.uuid) || 0
    const timeNow = event.level.time

    if (timeNow - lastSneak <= 10) { // パリィ受付：0.5秒以内
      // パリィ成功：ダメージ無効化 & 攻撃者のコンボをリセット
      event.cancel()
      comboMap.set(uuid, { time: 0, combo: 0 })

      target.level.playSound(null, target.blockPosition, "minecraft:item.shield.block", "player", 1.0, 1.0)
      target.sendMessage("パリィ成功！", true)
    }
  }
})

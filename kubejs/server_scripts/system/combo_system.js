// ファイル: kubejs/server_scripts/system/combo_system.js

// 攻撃者ごとにコンボ情報を保持
const comboMap = new Map()

EntityEvents.hurt(event => {
  const attacker = event.source.entity
  const target = event.entity

  if (!attacker || !target || attacker == target) return

  const uuid = attacker.uuid
  const currentTime = event.level.time

  const last = comboMap.get(uuid) || { time: 0, combo: 0 }

  if (currentTime - last.time <= 20) {
    // 1秒以内に再攻撃 → コンボ継続
    last.combo += 1
  } else {
    // コンボリセット
    last.combo = 1
  }

  last.time = currentTime
  comboMap.set(uuid, last)

  // ダメージ補正
  const multiplier = Math.pow(1.125, last.combo - 1)
  event.damage *= multiplier

  // 15%で麻痺付与（Lycanites Mobsのparalysis）
  if (Math.random() < 0.15) {
    target.addEffect("lycanitesmobs:paralysis", 60, 0) // 3秒程度
  }

  // デバッグ表示（必要なら）
  // attacker.tell(`Combo x${last.combo}, damage x${multiplier.toFixed(2)}`)
})

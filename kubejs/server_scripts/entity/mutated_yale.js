// ファイル: kubejs/server_scripts/mutated_yale.js
EntityEvents.hurt(event => {
  const source = event.source;
  const target = event.entity;

  // 攻撃している側がYaleであることを確認
  if (source.type == "lycanitesmobs:yale") {
    // 対象にParalysis（麻痺）効果を与える（5秒）
    target.addEffect("lycanitesmobs:paralysis", 100, 1); // 100tick = 5秒, Amplifier 1
  }
});

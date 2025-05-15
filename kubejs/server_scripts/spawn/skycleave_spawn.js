// 落下ダメージを受けた時に Vantair を召喚
// ファイルパス: kubejs/server_scripts/skycleave_spawn.js

ServerEvents.playerDamaged(event => {
  const {player, damageSource, damage} = event;

  if (damageSource.isFall() && damage >= 10) {
    const world = player.level;

    if (!world.isClientSide) {
      const pos = player.blockPosition();
      const yOffset = 2; // プレイヤーの少し上に出現

      world.server.runCommandSilent(
        `summon lycanitesmobs:skycleave ${pos.x} ${pos.y + yOffset} ${pos.z}`
      );
    }
  }
});

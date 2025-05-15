// ファイル: kubejs/server_scripts/infernality_attack.js

ServerEvents.tick(event => {
  const world = event.server.levels[0]; // Overworld
  const entities = world.getEntities().filter(e => e.type == 'lycanitesmobs:infernality');

  for (const entity of entities) {
    if (entity.ticksExisted % 8 == 0) { // 約0.4秒ごと
      const pos = entity.position();
      const speed = 3;

      const directions = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1]
      ];

      for (const [dx, dz] of directions) {
        world.server.runCommandSilent(
          `summon lycanitesmobs:embercharge ${pos.x} ${pos.y + 1} ${pos.z} ` +
          `{Motion:[${dx * speed},0.3,${dz * speed}]}`
        );
      }
    }
  }
});

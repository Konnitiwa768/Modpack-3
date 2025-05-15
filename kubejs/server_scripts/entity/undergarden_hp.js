ServerEvents.entitySpawned(event => {
  const entity = event.entity;
  if (!entity.level.isClientSide) {
    switch (entity.type) {
      case 'undergarden:brute':
        entity.getAttribute('minecraft:generic.max_health').baseValue = 40;
        entity.health = 40;
        entity.getAttribute('minecraft:generic.attack_damage').baseValue = 3;
        break;

      case 'undergarden:scintling':
        entity.getAttribute('minecraft:generic.max_health').baseValue = 10;
        entity.health = 10;
        entity.getAttribute('minecraft:generic.attack_damage').baseValue = 2;
        break;

      case 'undergarden:nargoyle':
        entity.getAttribute('minecraft:generic.max_health').baseValue = 30;
        entity.health = 30;
        entity.getAttribute('minecraft:generic.attack_damage').baseValue = 4;
        break;

      case 'undergarden:rotling':
        entity.getAttribute('minecraft:generic.max_health').baseValue = 12;
        entity.health = 12;
        entity.getAttribute('minecraft:generic.attack_damage').baseValue = 2;
        break;

      case 'undergarden:rotwalker':
        entity.getAttribute('minecraft:generic.max_health').baseValue = 26;
        entity.health = 26;
        entity.getAttribute('minecraft:generic.attack_damage').baseValue = 5;
        break;

      case 'undergarden:rotbeast':
        entity.getAttribute('minecraft:generic.max_health').baseValue = 80;
        entity.health = 80;
        entity.getAttribute('minecraft:generic.attack_damage').baseValue = 8;
        break;
    }
  }
});

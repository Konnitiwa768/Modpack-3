BlockEvents.broken(event => {
  const block = event.block
  const player = event.player

  if (block.id === 'minecraft:wheat' && block.properties.age === '7') {
    if (player.inventory.contains('minecraft:wheat_seeds')) {
      event.level.setBlock(block.pos, 'minecraft:wheat[age=0]')
      player.inventory.removeItem('minecraft:wheat_seeds', 1)
    }
  }
})

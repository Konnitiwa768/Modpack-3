// ======= GUIのスロット処理 =======
MenuEvents.slotClicked(event => {
  if (event.menuId !== 'kubejs:hpgui') return;

  const level = event.slot.index + 1;
  const player = event.player;
  const current = player.persistentData.getInt('hp_level') || 1;
  const xpCost = Math.pow(3, event.slot.index) * 8; // 経験値の式：8, 24, 72, 216, ...
  if (level > current && player.totalExperience >= xpCost) {
    player.removeXPExact(xpCost);
    player.persistentData.putInt('hp_level', level);
    player.tell(`HPレベルが ${level} になりました！`);
  }
});

// ======= GUI作成 =======
ServerEvents.dataPackLoaded(event => {
  event.addMenu('kubejs:hpgui', {
    slots: 27,
    size: 3,
    title: 'HPレベルアップ',
    slots: Array.from({ length: 27 }, (_, i) => ({
      index: i,
      item: Item.of('minecraft:emerald', `{display:{Name:'{"text":"HP Lv${i+1}"}'},Count:1}`),
      actions: [
        {
          type: 'slot-click',
          condition: { type: 'hasExperience', amount: Math.pow(3, i) * 8 },
        }
      ]
    }))
  });
});

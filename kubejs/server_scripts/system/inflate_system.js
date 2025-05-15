// ======= 設定値（理論上無限） =======
const xpForLevel = n => Math.pow(3, n) * 8; // 経験値の計算式：8, 24, 72, 216, ...
const hpMultiplier = n => Math.pow(6, n); // HP倍率（1倍, 2倍, 6倍, 12倍, 36倍...）

// ======= ワールド難易度（敵生成レベル分布） =======
ServerEvents.tick(e => {
  const overworld = e.server.overworld();
  const day = Math.floor(overworld.timeOfDay / 24000);
  const level = day + 1;
  e.server.persistentData.putInt('world_difficulty', level);
});

// ======= インフレ切り替えトグル（初期値：有効） =======
PlayerEvents.loggedIn(event => {
  const player = event.player;
  if (!player.persistentData.contains('inflation_active')) {
    player.persistentData.putBoolean('inflation_active', true); // デフォルト：有効
    player.tell("インフレシステムが有効になっています。");
  }

  // hplvアッパーを配布（なければ）
  const UPPER_ITEM = Item.of('minecraft:iron_ingot', '{display:{Name:\'{"text":"hplvアッパー"}\'}}');
  if (!player.inventory.find(UPPER_ITEM)) {
    player.give(UPPER_ITEM);
  }
});

// ======= GUI呼び出し（アッパー右クリック） =======
ItemEvents.rightClicked(event => {
  const UPPER_ITEM = Item.of('minecraft:iron_ingot', '{display:{Name:\'{"text":"hplvアッパー"}\'}}');
  if (event.item.equals(UPPER_ITEM)) {
    event.player.openMenu('kubejs:hpgui');
  }
});

// ======= インフレシステムの切り替え =======
ItemEvents.rightClicked(event => {
  const player = event.player;
  const UPPER_ITEM = Item.of('minecraft:iron_ingot', '{display:{Name:\'{"text":"hplvアッパー"}\'}}');
  if (event.item.equals(UPPER_ITEM)) {
    const inflationActive = player.persistentData.getBoolean('inflation_active');
    player.persistentData.putBoolean('inflation_active', !inflationActive); // トグル
    player.tell(inflationActive ? "インフレシステムが無効になりました。" : "インフレシステムが有効になりました。");
  }
});

// ======= 敵生成時にレベル分布に応じて変化 =======
EntityEvents.spawned(event => {
  const entity = event.entity;
  if (!entity.isMob() || entity.isPlayer()) return;

  const worldLevel = event.level.persistentData.getInt('world_difficulty') || 1;
  const inflationActive = entity.level.persistentData.getBoolean('inflation_active') ?? true;

  // 最大レベルに基づく敵レベルの設定
  const enemyLevel = Math.min(2147483647, Math.floor(Math.pow(worldLevel, 1.5))); // 最大値は2,147,648,347

  // モブの元々のHP取得
  const baseHealth = entity.getHealth(); // モブの基本HPを取得

  // ======= インフレ適用 =======
  let healthMultiplier = inflationActive ? 2 : 1; // インフレが有効な場合2倍
  let adjustedHealth = baseHealth * healthMultiplier * Math.pow(2, enemyLevel / 10); // レベルに応じて増加

  // モブの新しいHPの設定
  entity.maxHealth = adjustedHealth;
  entity.health = adjustedHealth;

  // モブの名前をレベルに応じて変更
  entity.customName = `Lv${enemyLevel} ${entity.displayName}`;
  entity.customNameVisible = true;
});

// ======= HP・攻撃・防御の常時更新 =======
PlayerEvents.tick(event => {
  const player = event.player;
  const level = player.persistentData.getInt('hp_level') || 1;
  const inflationActive = player.persistentData.getBoolean('inflation_active') ?? true;

  // 新しいHPを計算
  const newHP = 20 * hpMultiplier(level - 1);
  if (player.maxHealth !== newHP) player.setMaxHealth(newHP);

  // インフレ時には攻撃力や防御力の補正を強化
  player.persistentData.putInt("atk_bonus", Math.floor(Math.pow(1.5, level)) * (inflationActive ? 2 : 1));
  player.persistentData.putInt("def_bonus", Math.floor(Math.pow(1.3, level)) * (inflationActive ? 2 : 1));
});

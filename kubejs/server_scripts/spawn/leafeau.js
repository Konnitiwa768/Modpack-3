onEvent('block.break', (event) => {
    // 1%の確率でスポーン
    if (Math.random() < 0.01) {
        // 壊されたブロックの種類が葉っぱまたは原木の場合
        const block = event.getBlock();
        
        // 木の種類をチェック
        if (block.id.includes("leaves") || block.id.includes("log")) {
            // スポーン位置を設定
            const pos = event.getPlayer().getPosition();

            // 'leafeau'のエンティティを召喚するコマンド
            event.server.runCommandSilent(`/summon lycanitesmobs:leafeau ${pos.x} ${pos.y} ${pos.z}`);
        }
    }
});

export function preloadPlayerAssets(scene) {
    // Player sprite sheet (4 frames assumed 50x50)
    scene.load.spritesheet(
        "player",
        "assets/sprites/github-octopuss.png",
        {
            frameWidth: 50,
            frameHeight: 50
        }
    );
}

export function createPlayer(scene) {
    // 🎬 Animation
    scene.anims.create({
        key: "walk",
        frames: scene.anims.generateFrameNumbers("player", {
            start: 0,
            end: 3
        }),
        frameRate: 12,
        repeat: -1
    });

    // 👤 Player
    const player = scene.physics.add.sprite(100, scene.scale.height / 2, "player"); // Start from left side

    player.setScale(2);
    player.setDepth(1);
    player.setCollideWorldBounds(true);

    player.play("walk");

    const cursors = scene.input.keyboard.createCursorKeys();
    // Support WASD keys as well
    const wasd = scene.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        right: Phaser.Input.Keyboard.KeyCodes.D
    });

    return { player, cursors, wasd };
}

export function updatePlayerMovement(player, cursors, wasd) {
    player.setVelocity(0);

    // Movement using arrow keys or WASD
    const leftDown = (cursors && cursors.left && cursors.left.isDown) || (wasd && wasd.left && wasd.left.isDown);
    const rightDown = (cursors && cursors.right && cursors.right.isDown) || (wasd && wasd.right && wasd.right.isDown);
    const upDown = (cursors && cursors.up && cursors.up.isDown) || (wasd && wasd.up && wasd.up.isDown);
    const downDown = (cursors && cursors.down && cursors.down.isDown) || (wasd && wasd.down && wasd.down.isDown);

    if (leftDown) {
        player.setVelocityX(-350);
        player.anims.play("walk", true);
    } else if (rightDown) {
        player.setVelocityX(350);
        player.anims.play("walk", true);
    }

    if (upDown) {
        player.setVelocityY(-350);
        player.anims.play("walk", true);
    } else if (downDown) {
        player.setVelocityY(350);
        player.anims.play("walk", true);
    }

    if (!leftDown && !rightDown && !upDown && !downDown) {
        player.anims.stop();
    }

    // Depth sorting for 2.5D effect
    player.setDepth(player.y);
}
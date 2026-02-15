import { preloadPlayerAssets, createPlayer, updatePlayerMovement } from './player.js';
import { preloadPathAssets, createPathSystems, buildPaths } from './paths.js';
import { preloadZoneAssets, createZones, checkZoneCollision, resizeZones } from './zones.js';
import { processFountainImage, createWaterTexture, closeModal, showZoneContent, setupModalEvents } from './utils.js';

let player;
let cursors;
let zones = [];
let activeZone = null;
let fountainLight = null;
let wasd = null;
let bg = null;
let wallGroup = null;
let pathGroup = null;

const config = {
    type: Phaser.AUTO,
    pixelArt: true,
    roundPixels: true,
    scale: {
        mode: Phaser.Scale.RESIZE,
        width: '100%',
        height: '100%'
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload,
        create,
        update
    }
};

new Phaser.Game(config);

function preload() {
    preloadPlayerAssets(this);
    preloadPathAssets(this);
    preloadZoneAssets(this);
}

function create() {

    // 🌱 Big grass world
    bg = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, "grass")
        .setOrigin(0)
        .setDepth(-1000);

    // 🛣️ Path System
    const pathSystems = createPathSystems(this);
    pathGroup = pathSystems.pathGroup;
    wallGroup = pathSystems.wallGroup;

    // 👤 Player
    const playerData = createPlayer(this);
    player = playerData.player;
    cursors = playerData.cursors;
    wasd = playerData.wasd;

    // Collide with path walls (grass)
    this.physics.add.collider(player, wallGroup);

    // 🎥 Camera setup (Static)
    // this.cameras.main.startFollow(player); // Disabled for static screen

    // 🌍 World boundaries
    this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);
    this.cameras.main.setBounds(0, 0, this.scale.width, this.scale.height);

    // 📍 Create interactive zones
    processFountainImage(this);
    createWaterTexture(this);
    setupModalEvents();
    
    const zoneData = createZones(this, player);
    zones = zoneData.zones;
    fountainLight = zoneData.fountainLight;

    buildPaths(this, pathGroup, wallGroup, zones);

    // 🎮 Handle zone interactions
    this.input.keyboard.on('keydown-E', () => {
        if (activeZone) {
            showZoneContent(activeZone);
        }
    });

    // 🔑 Close modal with Escape key
    this.input.keyboard.on('keydown-ESC', () => {
        closeModal();
    });

    // 📏 Handle Window Resize
    this.scale.on('resize', (gameSize) => {
        const width = gameSize.width;
        const height = gameSize.height;

        // Update bounds
        this.physics.world.setBounds(0, 0, width, height);
        this.cameras.main.setBounds(0, 0, width, height);
        
        // Update background
        if (bg) bg.setSize(width, height);

        buildPaths(this, pathGroup, wallGroup, zones);
        resizeZones(this, zones);
    });
}

function update() {
    updatePlayerMovement(player, cursors, wasd);
    activeZone = checkZoneCollision(this, player, zones, fountainLight);
}

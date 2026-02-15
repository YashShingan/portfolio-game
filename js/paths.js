export function preloadPathAssets(scene) {
    // Grass tile
    scene.load.image("grass", "assets/tiles/grass.png");

    // Footpath tile
    scene.load.image("footpath", "assets/tiles/footpath.png");

    // New Path tiles
    scene.load.image("roadturn", "assets/tiles/roadturn.png");
    scene.load.image("cornerjoin", "assets/tiles/cornerjoin.png");
}

export function createPathSystems(scene) {
    const pathGroup = scene.add.group();
    const wallGroup = scene.physics.add.staticGroup();
    return { pathGroup, wallGroup };
}

export function buildPaths(scene, pathGroup, wallGroup, zones) {
    if (!wallGroup || !pathGroup) return;
    
    wallGroup.clear(true, true);
    pathGroup.clear(true, true);
    
    const w = scene.scale.width;
    const h = scene.scale.height;
    const cx = Math.floor(w * 0.5); // Fountain center X
    const cy = Math.floor(h * 0.5); // Fountain center Y
    
    // Config
    const pathW = 128; // Multiple of 32 for pixel perfect scaling
    const halfPath = pathW / 2;
    const overlap = 2; // Overlap to prevent visual gaps between tiles
    
    // Box dimensions (Asymmetric to give more space on top for fountain perspective)
    const boxWidth = 416; // Adjusted for integer math
    const boxHeightTop = 224; 
    const boxHeightBottom = 192; 
    
    const boxLeft = cx - boxWidth / 2;
    const boxRight = cx + boxWidth / 2;
    const boxTop = cy - boxHeightTop;
    const boxBottom = cy + boxHeightBottom;

    // Helper to add path visual
    const addPath = (x, y, width, height, isHorizontal) => {
        if (width <= 0 || height <= 0) return;
        // Scale texture to fit the path width exactly (avoiding side-by-side tiling)
        // Texture is 32x32, we want it to cover pathW
        const scale = pathW / 32;
        let tile;
        if (isHorizontal) {
            // Rotate 90 degrees for horizontal paths so the vertical texture aligns properly
            // Swap width/height in constructor because rotation swaps them visually
            tile = scene.add.tileSprite(x + width/2, y + height/2, height, width, "footpath");
            tile.setAngle(90);
            tile.setTileScale(scale);
        } else {
            tile = scene.add.tileSprite(x + width/2, y + height/2, width, height, "footpath");
            tile.setTileScale(scale);
        }
        tile.setDepth(-500); // Above grass (-1000), below everything else
        pathGroup.add(tile);
    };
    
    // Helper to add specific path tiles (corners/junctions)
    const addTile = (x, y, key, angle) => {
        const scale = pathW / 32; // Assuming 32x32 source
        // Place at center of the square defined by x,y,pathW,pathW
        const tile = scene.add.image(x + pathW/2, y + pathW/2, key);
        tile.setScale(scale);
        tile.setAngle(angle);
        tile.setDepth(-500);
        pathGroup.add(tile);
    };

    // Helper to add wall (invisible physics body for grass)
    const addWall = (x, y, width, height) => {
        if (width <= 0 || height <= 0) return;
        const wall = scene.add.rectangle(x + width/2, y + height/2, width, height, 0x000000, 0);
        scene.physics.add.existing(wall, true);
        wallGroup.add(wall);
    };
    
    // Determine Path Limits based on Zones
    // We want paths to stop at the zones, not go to infinity
    let topLimit = 0;
    let bottomLimit = h;
    let rightLimit = w;
    // Left starts at 0 (or player start)
    
    if (typeof zones !== 'undefined') {
        // Find zones by approximate position
        const zTop = zones.find(z => z.ratioY < 0.4);
        if (zTop) topLimit = (h * zTop.ratioY) + 40; // Stop near the noticeboard
        
        const zBottom = zones.find(z => z.ratioY > 0.6);
        if (zBottom) bottomLimit = (h * zBottom.ratioY) - 40;
        
        const zRight = zones.find(z => z.ratioX > 0.6);
        if (zRight) rightLimit = (w * zRight.ratioX) - 40;
    }

    // --- Visuals (The Path) ---
    
    // 1. Corners & Junctions
    // Top-Left Corner
    addTile(boxLeft, boxTop, 'roadturn', 270);
    // Top-Right Corner
    addTile(boxRight - pathW, boxTop, 'roadturn', 0);
    // Bottom-Right Corner
    addTile(boxRight - pathW, boxBottom - pathW, 'roadturn', 90);
    // Bottom-Left Corner
    addTile(boxLeft, boxBottom - pathW, 'roadturn', 180);

    // Top-Mid Junction
    addTile(cx - halfPath, boxTop, 'cornerjoin', 90);
    // Bottom-Mid Junction
    addTile(cx - halfPath, boxBottom - pathW, 'cornerjoin', 270);
    // Left-Mid Junction
    addTile(boxLeft, cy - halfPath, 'cornerjoin', 0);
    // Right-Mid Junction
    addTile(boxRight - pathW, cy - halfPath, 'cornerjoin', 180);

    // 2. Straight Segments (Filling the box sides)
    // Top Bar Left Gap
    addPath(boxLeft + pathW - overlap, boxTop, (cx - halfPath) - (boxLeft + pathW) + 2*overlap, pathW, true);
    // Top Bar Right Gap
    addPath(cx + halfPath - overlap, boxTop, (boxRight - pathW) - (cx + halfPath) + 2*overlap, pathW, true);
    // Bottom Bar Left Gap
    addPath(boxLeft + pathW - overlap, boxBottom - pathW, (cx - halfPath) - (boxLeft + pathW) + 2*overlap, pathW, true);
    // Bottom Bar Right Gap
    addPath(cx + halfPath - overlap, boxBottom - pathW, (boxRight - pathW) - (cx + halfPath) + 2*overlap, pathW, true);
    // Left Bar Top Gap
    addPath(boxLeft, boxTop + pathW - overlap, pathW, (cy - halfPath) - (boxTop + pathW) + 2*overlap, false);
    // Left Bar Bottom Gap
    addPath(boxLeft, cy + halfPath - overlap, pathW, (boxBottom - pathW) - (cy + halfPath) + 2*overlap, false);
    // Right Bar Top Gap
    addPath(boxRight - pathW, boxTop + pathW - overlap, pathW, (cy - halfPath) - (boxTop + pathW) + 2*overlap, false);
    // Right Bar Bottom Gap
    addPath(boxRight - pathW, cy + halfPath - overlap, pathW, (boxBottom - pathW) - (cy + halfPath) + 2*overlap, false);
    
    // 3. Spokes (Extending out)
    addPath(0, cy - halfPath, boxLeft + overlap, pathW, true); // Left
    addPath(boxRight - overlap, cy - halfPath, rightLimit - boxRight + overlap, pathW, true); // Right
    addPath(cx - halfPath, topLimit, pathW, (boxTop - topLimit) + overlap, false); // Top
    addPath(cx - halfPath, boxBottom - overlap, pathW, (bottomLimit - boxBottom) + overlap, false); // Bottom
    
    
    // --- Walls (The Grass / Non-Walkable Areas) ---
    // We create collision boxes for the areas surrounding the path
    
    // 1. Top-Left Region
    addWall(0, 0, boxLeft, cy - halfPath); // Left of box, above spoke
    addWall(0, cy + halfPath, boxLeft, h - (cy + halfPath)); // Left of box, below spoke
    addWall(boxLeft, 0, (cx - halfPath) - boxLeft, boxTop); // Above box, left of top spoke
    
    // 2. Top-Right Region
    addWall(boxRight, 0, w - boxRight, cy - halfPath); // Right of box, above spoke
    addWall(boxRight, cy + halfPath, w - boxRight, h - (cy + halfPath)); // Right of box, below spoke
    addWall(cx + halfPath, 0, boxRight - (cx + halfPath), boxTop); // Above box, right of top spoke
    
    // 3. Bottom Region
    addWall(boxLeft, boxBottom, (cx - halfPath) - boxLeft, h - boxBottom); // Below box, left of bottom spoke
    addWall(cx + halfPath, boxBottom, boxRight - (cx + halfPath), h - boxBottom); // Below box, right of bottom spoke
    
    // 5. Center Hole (Inside the Fountain Box)
    addWall(boxLeft + pathW, boxTop + pathW, boxWidth - 2*pathW, (boxBottom - boxTop) - 2*pathW);
    
    // 6. End of Path Walls (Stop the player from walking past the zones)
    if (topLimit > 0) addWall(cx - halfPath, 0, pathW, topLimit);
    if (bottomLimit < h) addWall(cx - halfPath, bottomLimit, pathW, h - bottomLimit);
    if (rightLimit < w) addWall(rightLimit, cy - halfPath, w - rightLimit, pathW);

    // Refresh physics
    scene.physics.world.step(0);
}
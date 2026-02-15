
export function preloadZoneAssets(scene) {
    // Fountain raw image (we'll process it in create to remove brown background)
    scene.load.image("fountain_raw", "assets/images/fountain.png");
    // Noticeboard image
    scene.load.image("noticeboard", "assets/images/noticeboard.png");
}

export function createZones(scene, player) {
    const width = scene.scale.width;
    const height = scene.scale.height;
    let fountainLight = null;
    let fountainSprite = null;

    // Example zones - customize these!
    const zones = [
        // 2. Notice board (Top) - Projects
        {
            type: 'noticeboard',
            ratioX: 0.5,
            ratioY: 0.12,
            width: 200,
            height: 150,
            title: "Projects",
            content: "1. Pixel Portfolio (Phaser.js)\n2. E-commerce Dashboard (React)\n3. Task API (Node.js)",
            color: 0x8B4513,
            emoji: ""
        },
        // 1. Fountain (Center) - About Me
        {
            type: 'fountain',
            ratioX: 0.5,
            ratioY: 0.5,
            width: 160,
            height: 160,
            title: "About Me",
            content: "Hi! I'm a creative developer passionate about building interactive web experiences and games.",
            color: 0x4488ff,
            emoji: ""
        },
        // 3. Garden (Right) - Skills
        {
            type: 'garden',
            ratioX: 0.85,
            ratioY: 0.5,
            width: 180,
            height: 150,
            title: "Skills",
            content: "Frontend: React, Phaser, HTML/CSS\nBackend: Node.js, Python\nTools: Git, Docker",
            color: 0x44ff44,
            emoji: "🌻"
        },
        // 4. Mailbox (Bottom) - Contact
        {
            type: 'mailbox',
            ratioX: 0.5,
            ratioY: 0.85,
            width: 80,
            height: 80,
            title: "Contact",
            content: "Email: hello@example.com\nLinkedIn: /in/dev\nGitHub: @dev",
            color: 0xff4444,
            emoji: "📫"
        }
    ];

    // Draw notice boards
    zones.forEach(zone => {
        const centerX = width * zone.ratioX;
        const centerY = height * zone.ratioY;
        
        // Store objects for resizing
        zone.objects = [];
        const addObject = (obj, ox = 0, oy = 0) => {
            obj.offsetX = ox;
            obj.offsetY = oy;
            zone.objects.push(obj);
        };

        const depth = centerY; // Base depth on Y position

        // --- Visuals based on Type ---
        
        if (zone.type === 'noticeboard') {
            if (scene.textures.exists('noticeboard')) {
                const nb = scene.physics.add.staticImage(centerX, centerY, 'noticeboard');
                nb.setScale(2.5);
                nb.setDepth(depth);
                nb.refreshBody();
                addObject(nb);
                scene.physics.add.collider(player, nb);
            } else {
                // Fallback graphics
                const graphics = scene.add.graphics();
                graphics.setDepth(depth);
                graphics.fillStyle(0x8B4513, 1);
                graphics.fillRect(-zone.width/2, -zone.height/2, zone.width, zone.height);
                graphics.lineStyle(4, 0x654321);
                graphics.strokeRect(-zone.width/2, -zone.height/2, zone.width, zone.height);
                graphics.setPosition(centerX, centerY);
                addObject(graphics);
                
                const body = scene.add.rectangle(centerX, centerY, zone.width, zone.height, 0, 0);
                scene.physics.add.existing(body, true);
                addObject(body);
                scene.physics.add.collider(player, body);
            }
        }
        
        else if (zone.type === 'garden') {
            // Draw a garden patch
            const graphics = scene.add.graphics();
            graphics.setDepth(depth - 1);
            
            graphics.fillStyle(0x2d5a27, 0.8);
            graphics.fillRoundedRect(-zone.width/2, -zone.height/2, zone.width, zone.height, 10);
            graphics.lineStyle(2, 0xffffff, 0.5);
            graphics.strokeRoundedRect(-zone.width/2, -zone.height/2, zone.width, zone.height, 10);

            // Flowers
            for(let i=0; i<8; i++) {
                const fx = -zone.width/2 + 20 + Math.random() * (zone.width - 40);
                const fy = -zone.height/2 + 20 + Math.random() * (zone.height - 40);
                graphics.fillStyle(0xff66cc, 1);
                graphics.fillCircle(fx, fy, 6);
                graphics.fillStyle(0xffff00, 1);
                graphics.fillCircle(fx, fy, 2);
            }
            graphics.setPosition(centerX, centerY);
            addObject(graphics);
            
            const body = scene.add.rectangle(centerX, centerY, zone.width, zone.height, 0, 0);
            scene.physics.add.existing(body, true);
            addObject(body);
            scene.physics.add.collider(player, body);
        }
        
        else if (zone.type === 'mailbox') {
            const graphics = scene.add.graphics();
            graphics.setDepth(depth);
            
            // Post
            graphics.fillStyle(0x666666, 1);
            graphics.fillRect(-5, 0, 10, 40);
            // Box
            graphics.fillStyle(0xcc3333, 1);
            graphics.fillRoundedRect(-20, -30, 40, 30, 5);
            
            graphics.setPosition(centerX, centerY);
            addObject(graphics);
            
            const body = scene.add.rectangle(centerX, centerY, 40, 40, 0, 0);
            scene.physics.add.existing(body, true);
            addObject(body);
            scene.physics.add.collider(player, body);
        }

        // If this is the Fountain zone
        else if (zone.type === 'fountain') {
            if (scene.textures.exists('fountain')) {
                // Visual only - use a separate collider for better control
                fountainSprite = scene.add.image(centerX, centerY, 'fountain');
                fountainSprite.setScale(0.6);
                fountainSprite.setOrigin(0.5, 0.5);
                fountainSprite.setDepth(depth);
                addObject(fountainSprite);
            } else {
                const g = scene.add.graphics();
                g.setDepth(depth);
                g.fillStyle(0x66ccff, 1);
                g.fillCircle(0, 0, Math.min(zone.width, zone.height) / 3);
                g.setPosition(centerX, centerY);
                addObject(g);
                const placeholder = scene.add.rectangle(centerX, centerY, zone.width / 2, zone.height / 2, 0x66ccff, 0);
                scene.physics.add.existing(placeholder, true);
                fountainSprite = placeholder;
                addObject(placeholder);
            }

            // Create a subtle light for fountain interaction (hidden until near)
            fountainLight = scene.add.circle(0, 0, 60, 0xffffff, 0.12).setBlendMode(Phaser.BlendModes.ADD);
            fountainLight.setVisible(false);

            if (fountainLight) {
                fountainLight.x = centerX;
                fountainLight.y = centerY - 10;
                fountainLight.setDepth(depth + 1);
                scene.tweens.add({
                    targets: fountainLight,
                    alpha: { from: 0.08, to: 0.35 },
                    duration: 900,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
                fountainLight.setVisible(false);
                addObject(fountainLight, 0, -10);
            }

            // Add water particles
            if (scene.textures.exists('droplet')) {
                const particles = scene.add.particles(centerX, centerY - 40, 'droplet', {
                    speed: { min: 50, max: 100 },
                    angle: { min: 250, max: 290 },
                    gravityY: 300,
                    lifespan: 800,
                    scale: { start: 0.5, end: 0 },
                    quantity: 1,
                    blendMode: 'ADD'
                });
                particles.setDepth(depth + 1);
                addObject(particles, 0, -40);
            }
        }

        // Zone emoji/icon
        if (zone.emoji) {
            scene.add.text(centerX, centerY - 40, zone.emoji, {
                fontSize: '40px',
                align: 'center'
            }).setOrigin(0.5).setDepth(depth + 10)
              .setPosition(centerX, centerY - 40); // ensure setPosition is called for consistency
            addObject(scene.children.list[scene.children.list.length - 1], 0, -40);
        }

        // Zone title
        scene.add.text(centerX, centerY + 40, zone.title, {
            fontSize: '16px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'center',
            wordWrap: { width: zone.width - 10 }
        }).setOrigin(0.5).setDepth(depth + 10);
        addObject(scene.children.list[scene.children.list.length - 1], 0, 40);

        // Interaction hint
        scene.add.text(centerX, centerY + 60, "Press E", {
            fontSize: '12px',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5).setDepth(depth + 10);
        addObject(scene.children.list[scene.children.list.length - 1], 0, 60);
    });

    return { zones, fountainLight };
}

export function checkZoneCollision(scene, player, zones, fountainLight) {
    let activeZone = null;

    zones.forEach(zone => {
        // Calculate current center based on ratio
        const centerX = scene.scale.width * zone.ratioX;
        const centerY = scene.scale.height * zone.ratioY;
        const distance = Phaser.Math.Distance.Between(
            player.x, player.y,
            centerX, centerY
        );

        if (distance < 180) {
            activeZone = zone;
            // Show "Press E" prompt
            if (document.getElementById('prompt')) {
                document.getElementById('prompt').style.display = 'block';
                document.getElementById('prompt').textContent = `Press E to interact with "${zone.title}"`;
            }
            // show fountain light when near the Skills zone
            if (zone.type === 'fountain' && fountainLight) {
                fountainLight.setVisible(true);
            }
        }
    });

    if (!activeZone && document.getElementById('prompt')) {
        document.getElementById('prompt').style.display = 'none';
        if (fountainLight) fountainLight.setVisible(false);
    }
    
    return activeZone;
}

export function resizeZones(scene, zones) {
    const width = scene.scale.width;
    const height = scene.scale.height;
    
    zones.forEach(zone => {
        const newX = width * zone.ratioX;
        const newY = height * zone.ratioY;

        if (zone.objects) {
            zone.objects.forEach(obj => {
                // Move object maintaining its relative offset from the zone center
                if (obj.setPosition) {
                    obj.setPosition(newX + (obj.offsetX || 0), newY + (obj.offsetY || 0));
                }
                // Update physics body if it exists
                if (obj.body && obj.body.updateFromGameObject) {
                    obj.body.updateFromGameObject();
                }
            });
        }
    });
}
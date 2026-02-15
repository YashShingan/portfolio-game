export function processFountainImage(scene) {
    try {
        const src = scene.textures.get('fountain_raw').getSourceImage();
        if (src) {
            const w = src.width;
            const h = src.height;
            const canvas = scene.textures.createCanvas('fountain_canvas', w, h).getSourceImage();
            const ctx = canvas.getContext('2d');
            ctx.drawImage(src, 0, 0);
            const imgData = ctx.getImageData(0, 0, w, h);
            const data = imgData.data;
            // Target brown color #8B4513 (139,69,19)
            const tr = 139, tg = 69, tb = 19;
            const tol = 70; // tolerance
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i], g = data[i + 1], b = data[i + 2];
                const dr = Math.abs(r - tr);
                const dg = Math.abs(g - tg);
                const db = Math.abs(b - tb);
                if (dr < tol && dg < tol && db < tol) {
                    // make pixel transparent
                    data[i + 3] = 0;
                }
            }
            ctx.putImageData(imgData, 0, 0);
            // Add the processed canvas as 'fountain' texture
            scene.textures.addCanvas('fountain', canvas);
            // remove temporary canvas texture key
            scene.textures.remove('fountain_canvas');
        }
    } catch (e) {
        // if processing fails, fallback: copy fountain_raw to fountain
        try { scene.textures.addImage('fountain', scene.textures.get('fountain_raw').getSourceImage()); } catch (err) {}
    }
}

export function createWaterTexture(scene) {
    const graphics = scene.make.graphics({x: 0, y: 0, add: false});
    graphics.fillStyle(0x88ccff, 1);
    graphics.fillCircle(4, 4, 4);
    graphics.generateTexture('droplet', 8, 8);
}

export function showZoneContent(zone) {
    const modal = document.getElementById('modal');
    if (modal) {
        document.getElementById('modal-title').textContent = zone.title;
        document.getElementById('modal-content').textContent = zone.content;
        // Cloudy popup specifically for fountain/Skills
        if (zone.type === 'fountain') {
            modal.classList.add('cloudy');
        } else {
            modal.classList.remove('cloudy');
        }
        modal.classList.add('active');
    }
}

export function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.classList.remove('active');
        modal.classList.remove('cloudy');
    }
}

export function setupModalEvents() {
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close-btn');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'modal') {
                closeModal();
            }
        });
    }
}
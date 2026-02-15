# Pixel Portfolio Game

An interactive portfolio website presented as a 2D top-down RPG game. Built with JavaScript and the Phaser 3 framework.

## 🎮 Features

-   **Interactive World**: Explore a pixel art world representing a professional portfolio.
-   **Zones**:
    -   ⛲ **Fountain (About Me)**: Learn about the developer.
    -   📋 **Noticeboard (Projects)**: View showcased projects.
    -   🌻 **Garden (Skills)**: See technical skills and tools.
    -   📫 **Mailbox (Contact)**: Get contact information.
-   **Path System**: Custom path visuals with collision detection (stay on the path!).
-   **Responsive**: The game world resizes to fit your browser window.

## 🛠️ Technologies

-   **Phaser 3**: Game framework for rendering and physics.
-   **JavaScript (ES6)**: Modular code structure.
-   **HTML5 & CSS3**: UI overlays and modals.

## 🚀 How to Run

Serve it through a local web server.

### 1. Vs code
Download the extension `Go live server` and run through it.

### 2. Python
If you have Python installed, run this in the project folder:
```bash
# Python 3
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

### 3. Node.js
```bash
npx http-server .
```

## 🕹️ Controls

-   **Move**: `W`, `A`, `S`, `D` or Arrow Keys.
-   **Interact**: Press `E` when near an object (a prompt will appear).
-   **Close Popup**: Press `ESC` or click the close button/outside the modal.

## 📂 Project Structure

-   `index.html`: Entry point and UI overlays.
-   `js/`: Game logic.
    -   `main.js`: Game initialization and loop.
    -   `player.js`: Player sprite and movement logic.
    -   `paths.js`: Tile generation and collision walls.
    -   `zones.js`: Interactive objects and content data.
    -   `utils.js`: Helper functions.
-   `assets/`: Images and sprites.
-   `css/`: Styling for HTML overlays.

## 🎨 Credits

-   **Engine**: Phaser 3

## 🌐 Deployment

To play this game online:
1.  Push this repository to GitHub.
2.  Go to **Settings** > **Pages**.
3.  Select the `main` branch and `/ (root)` folder, then click **Save**.
4.  Your game will be live at `https://<username>.github.io/<repo-name>/`.

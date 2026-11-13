# GitHub Repository Metadata Guide

This guide specifies the repository "About" metadata (description, website URL, and topic tags) for the **portfolio-game** repository ([`YashShingan/portfolio-game`](https://github.com/YashShingan/portfolio-game)), along with step-by-step instructions to apply them via the GitHub CLI, REST API (cURL / PowerShell), and the GitHub Web UI.

---

## 1. Quick Reference Matrix

| Field | Value | Constraints / Notes |
|:---|:---|:---|
| **Repository** | `YashShingan/portfolio-game` | Public GitHub repository |
| **Primary Description** | `Interactive 2D top-down RPG portfolio website and retro game built with Next.js 16, Phaser 3, TypeScript, and Tailwind CSS.` | 123 characters (GitHub maximum: 350) |
| **Website URL** | `https://yashshingan.github.io/portfolio-game/` | GitHub Pages live deployment URL |
| **Topic Tags** | `20` tags | Maximum allowed by GitHub Topics API |
| **License** | `MIT License` | Standard MIT (Yash Shingan, 2026) |

---

## 2. Formulated Repository Description Variants

GitHub allows up to **350 characters** for the repository description. Below are formulated variants tailored for different contexts:

### Variant 1: Primary Recommended (123 characters)
> **`Interactive 2D top-down RPG portfolio website and retro game built with Next.js 16, Phaser 3, TypeScript, and Tailwind CSS.`**
- *Rationale*: Concise, professional, and highlights both the genre (2D top-down RPG) and core technology stack (Next.js 16, Phaser 3, TypeScript, Tailwind CSS). Displays cleanly on desktop and mobile GitHub repo headers without truncation. Aligned identically with `package.json` `"description"`.

### Variant 2: Version-Specific Variant (126 characters)
> **`Interactive 2D top-down RPG portfolio website and retro game built with Next.js 16, Phaser 3.90, TypeScript, and Tailwind CSS.`**
- *Rationale*: Specifies the exact engine release (Phaser 3.90).

### Variant 3: Feature & Gameplay Focused (187 characters)
> **`An interactive 2D retro RPG portfolio game built with Next.js 16, Phaser 3, and TypeScript. Explore project showcases, skill gardens, real-time multiplayer ghosts, and chiptune audio.`**
- *Rationale*: Spotlights experiential features (multiplayer ghost visitors, procedural chiptune audio synth, interactive showcases).

### Variant 4: Visual & Emoji Flair (191 characters)
> **`🎮 Interactive 2D retro RPG portfolio game built with Next.js 16, Phaser 3, and TypeScript. Explore project noticeboards, skill gardens, multiplayer ghosts, and procedural chiptune audio.`**
- *Rationale*: Engaging visual presence in social previews and GitHub explore feeds.

### Variant 5: Compact / Minimalist (84 characters)
> **`Interactive 2D RPG portfolio game built with Next.js 16, Phaser 3, and Tailwind CSS.`**
- *Rationale*: Minimalist description for high-density directory cards.

---

## 3. Website URL

```text
https://yashshingan.github.io/portfolio-game/
```
- Directs users to the live static export deployed by `.github/workflows/deploy.yml`.
- Configured with Next.js `basePath: "/portfolio-game"` and unoptimized asset paths.

---

## 4. Curated 20 Topics Catalog

GitHub permits **up to 20 topics** per repository. Each topic must contain only lowercase letters, numbers, and hyphens (`-`), and be at most 35 characters long (`^[a-z0-9]+(?:-[a-z0-9]+)*$`).

| # | Category | Topic Tag | Length | Strategic Purpose |
|:---:|:---|:---|:---:|:---|
| 1 | Portfolio & Identity | `portfolio` | 9 | Core discoverability for developer portfolios |
| 2 | Portfolio & Identity | `portfolio-website` | 17 | Standard tag for web-based portfolios |
| 3 | Portfolio & Identity | `interactive-portfolio` | 21 | Highlights non-static, gamified nature |
| 4 | Portfolio & Identity | `developer-portfolio` | 19 | Recruiter and peer engineer search indexing |
| 5 | Portfolio & Identity | `game-portfolio` | 14 | Niche discoverability for playable portfolio games |
| 6 | Game Tech & Engine | `phaser` | 6 | Official Phaser game engine tag |
| 7 | Game Tech & Engine | `phaser3` | 7 | Specific engine generation (Phaser 3.90) |
| 8 | Game Tech & Engine | `game-development` | 16 | Broad game engineering community |
| 9 | Game Tech & Engine | `web-game` | 8 | Browser-based games index |
| 10 | Game Tech & Engine | `2d-game` | 7 | Dimensionality and camera perspective |
| 11 | Retro & Gameplay | `rpg` | 3 | Core genre (top-down role-playing game) |
| 12 | Retro & Gameplay | `pixel-art` | 9 | Aesthetic classification for sprites and tiles |
| 13 | Retro & Gameplay | `retro-gaming` | 12 | Retro gaming enthusiasts tag |
| 14 | Retro & Gameplay | `chiptune` | 8 | Procedural Web Audio 8-bit sound design |
| 15 | Web & Frontend Stack | `nextjs` | 6 | Next.js 16 App Router foundation |
| 16 | Web & Frontend Stack | `react` | 5 | React 19 UI component overlay |
| 17 | Web & Frontend Stack | `typescript` | 10 | Type-safe codebase |
| 18 | Web & Frontend Stack | `tailwindcss` | 11 | Tailwind CSS 4 styling |
| 19 | Web & Frontend Stack | `web-audio-api` | 13 | Zero-download procedural synthesizer |
| 20 | Real-Time Networking | `server-sent-events` | 18 | Multiplayer ghost visitor presence |

### Comma-Separated Raw Topic String (for Copy-Pasting)
```text
portfolio, portfolio-website, interactive-portfolio, developer-portfolio, game-portfolio, phaser, phaser3, game-development, web-game, 2d-game, rpg, pixel-art, retro-gaming, chiptune, nextjs, react, typescript, tailwindcss, web-audio-api, server-sent-events
```

---

## 5. Step-by-Step Application Instructions

### Method 1: GitHub CLI (`gh repo edit`)
If you have the GitHub CLI installed and authenticated (`gh auth login`):

```bash
gh repo edit YashShingan/portfolio-game \
  --description "Interactive 2D top-down RPG portfolio website and retro game built with Next.js 16, Phaser 3, TypeScript, and Tailwind CSS." \
  --homepage "https://yashshingan.github.io/portfolio-game/" \
  --add-topic "portfolio,portfolio-website,interactive-portfolio,developer-portfolio,game-portfolio,phaser,phaser3,game-development,web-game,2d-game,rpg,pixel-art,retro-gaming,chiptune,nextjs,react,typescript,tailwindcss,web-audio-api,server-sent-events"
```

---

### Method 2: GitHub REST API via cURL
Requires a GitHub Personal Access Token (PAT) with `repo` scope:

```bash
# 1. Set your Personal Access Token
export GITHUB_TOKEN="ghp_your_personal_access_token_here"

# 2. Update Repository Description and Homepage Website URL
curl -L \
  -X PATCH \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/YashShingan/portfolio-game \
  -d '{
    "description": "Interactive 2D top-down RPG portfolio website and retro game built with Next.js 16, Phaser 3, TypeScript, and Tailwind CSS.",
    "homepage": "https://yashshingan.github.io/portfolio-game/",
    "has_issues": true,
    "has_projects": true,
    "has_wiki": false
  }'

# 3. Update Repository Topics (replaces all topics)
curl -L \
  -X PUT \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/YashShingan/portfolio-game/topics \
  -d '{
    "names": [
      "portfolio",
      "portfolio-website",
      "interactive-portfolio",
      "developer-portfolio",
      "game-portfolio",
      "phaser",
      "phaser3",
      "game-development",
      "web-game",
      "2d-game",
      "rpg",
      "pixel-art",
      "retro-gaming",
      "chiptune",
      "nextjs",
      "react",
      "typescript",
      "tailwindcss",
      "web-audio-api",
      "server-sent-events"
    ]
  }'
```

---

### Method 3: PowerShell Automation Script (`scripts/apply-github-about.ps1`)
Use the included cross-platform PowerShell automation script:

```powershell
# 1. Dry-run preview without making network calls:
.\scripts\apply-github-about.ps1 -DryRun

# 2. Live apply with environment variable:
$env:GITHUB_TOKEN = "ghp_your_token_here"
.\scripts\apply-github-about.ps1

# 3. Live apply with explicit token parameter:
.\scripts\apply-github-about.ps1 -Token "ghp_your_token_here"

# 4. Interactive prompt (prompts securely if token is omitted):
.\scripts\apply-github-about.ps1
```

---

### Method 4: Manual GitHub Web UI Walkthrough
1. Navigate to [`https://github.com/YashShingan/portfolio-game`](https://github.com/YashShingan/portfolio-game) in your browser.
2. Ensure you are signed into your GitHub account (`YashShingan`).
3. In the right-hand sidebar on the repository root page, locate the **About** section.
4. Click the **gear icon** (`⚙️`) next to About to open the **Edit repository details** modal.
5. Enter the values:
   - **Description**:  
     `Interactive 2D top-down RPG portfolio website and retro game built with Next.js 16, Phaser 3, TypeScript, and Tailwind CSS.`
   - **Website**:  
     `https://yashshingan.github.io/portfolio-game/` (or check the box "Use your GitHub Pages website").
   - **Topics**: Add each topic individually:  
     `portfolio`, `portfolio-website`, `interactive-portfolio`, `developer-portfolio`, `game-portfolio`, `phaser`, `phaser3`, `game-development`, `web-game`, `2d-game`, `rpg`, `pixel-art`, `retro-gaming`, `chiptune`, `nextjs`, `react`, `typescript`, `tailwindcss`, `web-audio-api`, `server-sent-events`.
   - **Include in the home page**: Check **Releases**, **Packages**, and **Environments**.
6. Click **Save changes**.

---

## 6. Package & Repository Metadata Alignment

The repository About metadata strictly aligns with the package metadata configured in `package.json`:

| Metadata Concept | GitHub Repository About | `package.json` Field |
|:---|:---|:---|
| **Identity / Name** | `YashShingan/portfolio-game` | `"name": "@yashshingan/portfolio-game"` |
| **Summary** | Description | `"description"` |
| **Live Site** | Website URL | `"homepage"` |
| **Discovery Tags** | Topics (20 tags) | `"keywords"` (20 items) |
| **Source Repository** | GitHub Repo URL | `"repository.url"` |
| **Issue Tracker** | Issues tab | `"bugs.url"` |
| **Licensing** | License badge | `"license": "MIT"` |
| **Access Policy** | Public repository | `"publishConfig": {"access": "public", ...}` |

---

## 7. Verification & Troubleshooting

### Verify Applied Metadata via GitHub REST API
```bash
curl -s -H "Accept: application/vnd.github+json" https://api.github.com/repos/YashShingan/portfolio-game | jq '{description, homepage, topics}'
```

### Common HTTP Error Codes & Resolutions
- **HTTP 401 Unauthorized**: The Personal Access Token is invalid, expired, or missing. Generate a new PAT at [https://github.com/settings/tokens](https://github.com/settings/tokens).
- **HTTP 403 Forbidden**: The token lacks `repo` scope permissions for `YashShingan/portfolio-game` or API rate limits were exceeded.
- **HTTP 404 Not Found**: The repository does not exist or private repository cannot be accessed by the token.
- **HTTP 422 Unprocessable Entity**: Validation failure:
  - More than 20 topics provided (limit: 20).
  - Topic contains uppercase characters, spaces, or underscores (must match `^[a-z0-9]+(?:-[a-z0-9]+)*$`).
  - Topic exceeds 35 characters.
  - Description exceeds 350 characters.

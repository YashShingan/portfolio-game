import { audio } from './chunk-ISDBGZ27.mjs';
import { useRef, useState, useCallback, useEffect } from 'react';
import { Trophy, Play, Waves, RotateCcw } from 'lucide-react';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';

var CANVAS_WIDTH = 320;
var CANVAS_HEIGHT = 180;
var SPRINT_DURATION = 10;
var GRAVITY = 520;
var FLAP_VELOCITY = -185;
var MAX_FALL_SPEED = 260;
var SCROLL_SPEED = 86;
var PIPE_SPAWN_INTERVAL = 1.6;
var PIPE_GAP_HEIGHT = 56;
var PIPE_WIDTH = 26;
var OCTO_RADIUS = 7.5;
var OCTO_X = 64;
var HIGH_SCORE_KEY = "pg_flappy_octo_best";
function getStoredBestTime() {
  if (typeof window === "undefined") return 0;
  try {
    const saved = localStorage.getItem(HIGH_SCORE_KEY);
    if (saved) {
      const val = parseFloat(saved);
      if (Number.isFinite(val)) return val;
    }
  } catch (e) {
  }
  return 0;
}
function createInitialBubbles() {
  const bubbles = [];
  for (let i = 0; i < 18; i++) {
    bubbles.push({
      x: Math.random() * CANVAS_WIDTH,
      y: Math.random() * CANVAS_HEIGHT,
      speed: 12 + Math.random() * 20,
      radius: 1 + Math.random() * 2.2,
      wiggleOffset: Math.random() * Math.PI * 2,
      alpha: 0.2 + Math.random() * 0.45
    });
  }
  return bubbles;
}
function ArcadeMiniGame() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [gameState, setGameState] = useState("ready");
  const [timeLeft, setTimeLeft] = useState(SPRINT_DURATION);
  const [bestTime, setBestTime] = useState(getStoredBestTime);
  const [clearedCount, setClearedCount] = useState(0);
  const simRef = useRef({
    state: "ready",
    timeLeft: SPRINT_DURATION,
    octoY: CANVAS_HEIGHT / 2 - 4,
    octoVy: 0,
    octoAngle: 0,
    flapTimer: 0,
    pipes: [],
    particles: [],
    bubbles: createInitialBubbles(),
    lastTime: 0,
    pipeTimer: 0,
    clearedCount: 0,
    runId: 0
  });
  const recordBestTime = useCallback((timeSurvived) => {
    try {
      const currentBest = parseFloat(localStorage.getItem(HIGH_SCORE_KEY) || "0") || 0;
      if (timeSurvived > currentBest) {
        const rounded = Math.round(timeSurvived * 10) / 10;
        localStorage.setItem(HIGH_SCORE_KEY, rounded.toString());
        setBestTime(rounded);
      }
    } catch (e) {
    }
  }, []);
  const spawnFlapParticles = useCallback((x, y) => {
    const sim = simRef.current;
    for (let i = 0; i < 4; i++) {
      sim.particles.push({
        x: x - 6 + (Math.random() * 4 - 2),
        y: y + 4 + (Math.random() * 4 - 2),
        vx: -25 - Math.random() * 35,
        vy: (Math.random() - 0.5) * 30,
        size: 1.5 + Math.random() * 2,
        alpha: 0.8,
        color: "#a5f3fc",
        life: 0,
        maxLife: 0.35 + Math.random() * 0.2
      });
    }
  }, []);
  const spawnVictoryParticles = useCallback(() => {
    const sim = simRef.current;
    const colors = ["#fde047", "#f43f5e", "#38bdf8", "#4ade80", "#c084fc", "#fb923c"];
    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 120;
      sim.particles.push({
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 30,
        size: 2 + Math.random() * 2.5,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: 1.2 + Math.random() * 0.8
      });
    }
  }, []);
  const spawnCrashParticles = useCallback((x, y) => {
    const sim = simRef.current;
    for (let i = 0; i < 22; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 25 + Math.random() * 85;
      sim.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.5 + Math.random() * 2.5,
        alpha: 1,
        color: Math.random() > 0.4 ? "#f43f5e" : "#fdba74",
        life: 0,
        maxLife: 0.45 + Math.random() * 0.35
      });
    }
  }, []);
  const triggerFlap = useCallback(() => {
    const sim = simRef.current;
    if (sim.state === "ready") {
      sim.state = "playing";
      sim.timeLeft = SPRINT_DURATION;
      sim.octoY = CANVAS_HEIGHT / 2 - 10;
      sim.octoVy = FLAP_VELOCITY;
      sim.pipes = [];
      sim.pipeTimer = 0.6;
      sim.clearedCount = 0;
      setGameState("playing");
      setTimeLeft(SPRINT_DURATION);
      setClearedCount(0);
      spawnFlapParticles(OCTO_X, sim.octoY);
      try {
        audio.open();
      } catch (e) {
      }
      return;
    }
    if (sim.state === "playing") {
      sim.octoVy = FLAP_VELOCITY;
      sim.flapTimer = 0.18;
      spawnFlapParticles(OCTO_X, sim.octoY);
      try {
        audio.open();
      } catch (e) {
      }
      return;
    }
    if (sim.state === "won" || sim.state === "gameover") {
      sim.state = "playing";
      sim.timeLeft = SPRINT_DURATION;
      sim.octoY = CANVAS_HEIGHT / 2 - 10;
      sim.octoVy = FLAP_VELOCITY;
      sim.pipes = [];
      sim.pipeTimer = 0.6;
      sim.clearedCount = 0;
      setGameState("playing");
      setTimeLeft(SPRINT_DURATION);
      setClearedCount(0);
      spawnFlapParticles(OCTO_X, sim.octoY);
      try {
        audio.open();
      } catch (e) {
      }
      return;
    }
  }, [spawnFlapParticles]);
  const resetGame = useCallback(() => {
    const sim = simRef.current;
    sim.state = "ready";
    sim.timeLeft = SPRINT_DURATION;
    sim.octoY = CANVAS_HEIGHT / 2 - 4;
    sim.octoVy = 0;
    sim.pipes = [];
    sim.clearedCount = 0;
    setGameState("ready");
    setTimeLeft(SPRINT_DURATION);
    setClearedCount(0);
  }, []);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat) return;
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        e.stopPropagation();
        triggerFlap();
      }
    };
    window.addEventListener("keydown", handleKeyDown, { capture: true, passive: false });
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [triggerFlap]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId;
    const sim = simRef.current;
    sim.lastTime = performance.now();
    const loop = (now) => {
      animId = requestAnimationFrame(loop);
      let dt = (now - sim.lastTime) / 1e3;
      sim.lastTime = now;
      if (dt > 0.08) dt = 0.08;
      if (dt <= 0) dt = 0.016;
      for (const b of sim.bubbles) {
        b.y -= b.speed * dt;
        b.x += Math.sin(now * 3e-3 + b.wiggleOffset) * 0.3;
        if (b.y < -10) {
          b.y = CANVAS_HEIGHT + 10;
          b.x = Math.random() * CANVAS_WIDTH;
        }
      }
      for (let i = sim.particles.length - 1; i >= 0; i--) {
        const p = sim.particles[i];
        p.life += dt;
        if (p.life >= p.maxLife) {
          sim.particles.splice(i, 1);
          continue;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);
      }
      if (sim.state === "ready") {
        sim.octoY = CANVAS_HEIGHT / 2 + Math.sin(now * 5e-3) * 5;
        sim.octoAngle = Math.sin(now * 4e-3) * 0.1;
      } else if (sim.state === "playing") {
        sim.timeLeft = Math.max(0, sim.timeLeft - dt);
        setTimeLeft(Math.round(sim.timeLeft * 10) / 10);
        if (sim.timeLeft <= 0) {
          sim.state = "won";
          setGameState("won");
          recordBestTime(SPRINT_DURATION);
          spawnVictoryParticles();
          try {
            audio.achieve();
          } catch (e) {
          }
        } else {
          sim.octoVy = Math.min(MAX_FALL_SPEED, sim.octoVy + GRAVITY * dt);
          sim.octoY += sim.octoVy * dt;
          const targetAngle = Math.max(-0.4, Math.min(0.7, sim.octoVy * 35e-4));
          sim.octoAngle += (targetAngle - sim.octoAngle) * 0.2;
          if (sim.flapTimer > 0) {
            sim.flapTimer -= dt;
          }
          sim.pipeTimer -= dt;
          if (sim.pipeTimer <= 0) {
            sim.pipeTimer = PIPE_SPAWN_INTERVAL;
            const minGapY = 32;
            const maxGapY = CANVAS_HEIGHT - 32 - PIPE_GAP_HEIGHT;
            const gapY = minGapY + Math.random() * (maxGapY - minGapY);
            sim.pipes.push({
              x: CANVAS_WIDTH + 10,
              gapY,
              passed: false,
              colorType: Math.random() > 0.45 ? 1 : 0
            });
          }
          const floorY = CANVAS_HEIGHT - 12;
          if (sim.octoY - OCTO_RADIUS <= 2 || sim.octoY + OCTO_RADIUS >= floorY) {
            sim.state = "gameover";
            setGameState("gameover");
            const survived = SPRINT_DURATION - sim.timeLeft;
            recordBestTime(survived);
            spawnCrashParticles(OCTO_X, sim.octoY);
            try {
              audio.close();
            } catch (e) {
            }
          }
          for (let i = sim.pipes.length - 1; i >= 0; i--) {
            const pipe = sim.pipes[i];
            pipe.x -= SCROLL_SPEED * dt;
            if (!pipe.passed && pipe.x + PIPE_WIDTH < OCTO_X) {
              pipe.passed = true;
              sim.clearedCount++;
              setClearedCount(sim.clearedCount);
            }
            const topRect = {
              x: pipe.x,
              y: 0,
              w: PIPE_WIDTH,
              h: pipe.gapY
            };
            const botRect = {
              x: pipe.x,
              y: pipe.gapY + PIPE_GAP_HEIGHT,
              w: PIPE_WIDTH,
              h: CANVAS_HEIGHT - (pipe.gapY + PIPE_GAP_HEIGHT)
            };
            const checkCollision = (rx, ry, rw, rh) => {
              const closestX = Math.max(rx, Math.min(OCTO_X, rx + rw));
              const closestY = Math.max(ry, Math.min(sim.octoY, ry + rh));
              const dx = OCTO_X - closestX;
              const dy = sim.octoY - closestY;
              return dx * dx + dy * dy < OCTO_RADIUS * OCTO_RADIUS;
            };
            if (sim.state === "playing" && (checkCollision(topRect.x, topRect.y, topRect.w, topRect.h) || checkCollision(botRect.x, botRect.y, botRect.w, botRect.h))) {
              sim.state = "gameover";
              setGameState("gameover");
              const survived = SPRINT_DURATION - sim.timeLeft;
              recordBestTime(survived);
              spawnCrashParticles(OCTO_X, sim.octoY);
              try {
                audio.close();
              } catch (e) {
              }
            }
            if (pipe.x < -PIPE_WIDTH - 20) {
              sim.pipes.splice(i, 1);
            }
          }
        }
      } else if (sim.state === "gameover") {
        if (sim.octoY + OCTO_RADIUS < CANVAS_HEIGHT - 12) {
          sim.octoY += 40 * dt;
          sim.octoAngle += 0.5 * dt;
        }
      } else if (sim.state === "won") {
        sim.octoY = CANVAS_HEIGHT / 2 + Math.sin(now * 8e-3) * 8;
        sim.octoAngle = Math.sin(now * 6e-3) * 0.15;
      }
      ctx.imageSmoothingEnabled = false;
      const bgGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      bgGrad.addColorStop(0, "#0b263b");
      bgGrad.addColorStop(0.5, "#081b2b");
      bgGrad.addColorStop(1, "#040d16");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.save();
      ctx.globalAlpha = 0.07;
      ctx.fillStyle = "#38bdf8";
      for (let r = 0; r < 4; r++) {
        const offset = Math.sin(now * 1e-3 + r * 1.5) * 18;
        ctx.beginPath();
        ctx.moveTo(30 + r * 70 + offset, 0);
        ctx.lineTo(60 + r * 70 + offset, 0);
        ctx.lineTo(95 + r * 70 + offset, CANVAS_HEIGHT);
        ctx.lineTo(45 + r * 70 + offset, CANVAS_HEIGHT);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
      for (const b of sim.bubbles) {
        ctx.save();
        ctx.globalAlpha = b.alpha;
        ctx.fillStyle = "#bae6fd";
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(b.x - b.radius * 0.4, b.y - b.radius * 0.4, 1, 1);
        ctx.restore();
      }
      ctx.save();
      ctx.fillStyle = "#06222b";
      ctx.globalAlpha = 0.45;
      for (let s = 0; s < 6; s++) {
        const sx = (s * 60 + now * 0.015 % 360) % 360 - 20;
        const sway = Math.sin(now * 2e-3 + s) * 6;
        ctx.beginPath();
        ctx.moveTo(sx, CANVAS_HEIGHT - 12);
        ctx.quadraticCurveTo(sx + sway, CANVAS_HEIGHT - 45, sx - sway * 0.5, CANVAS_HEIGHT - 70);
        ctx.lineTo(sx + 10 - sway * 0.5, CANVAS_HEIGHT - 70);
        ctx.quadraticCurveTo(sx + 10 + sway, CANVAS_HEIGHT - 45, sx + 10, CANVAS_HEIGHT - 12);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
      for (const pipe of sim.pipes) {
        const isCoral = pipe.colorType === 1;
        const mainColor = isCoral ? "#ea580c" : "#059669";
        const lightColor = isCoral ? "#fb923c" : "#10b981";
        const darkColor = isCoral ? "#9a3412" : "#064e3b";
        const rimColor = isCoral ? "#ffedd5" : "#a7f3d0";
        ctx.fillStyle = mainColor;
        ctx.fillRect(pipe.x + 2, 0, PIPE_WIDTH - 4, pipe.gapY - 6);
        ctx.fillStyle = lightColor;
        ctx.fillRect(pipe.x + 4, 0, 3, pipe.gapY - 6);
        ctx.fillStyle = darkColor;
        ctx.fillRect(pipe.x + PIPE_WIDTH - 5, 0, 3, pipe.gapY - 6);
        ctx.fillStyle = mainColor;
        ctx.fillRect(pipe.x, pipe.gapY - 8, PIPE_WIDTH, 8);
        ctx.fillStyle = lightColor;
        ctx.fillRect(pipe.x, pipe.gapY - 8, PIPE_WIDTH, 2);
        ctx.fillStyle = darkColor;
        ctx.fillRect(pipe.x, pipe.gapY - 2, PIPE_WIDTH, 2);
        ctx.fillStyle = rimColor;
        ctx.fillRect(pipe.x + 3, pipe.gapY - 6, 2, 2);
        ctx.fillRect(pipe.x + 11, pipe.gapY - 5, 3, 2);
        ctx.fillRect(pipe.x + 19, pipe.gapY - 6, 2, 2);
        const botY = pipe.gapY + PIPE_GAP_HEIGHT;
        const botH = CANVAS_HEIGHT - botY;
        ctx.fillStyle = mainColor;
        ctx.fillRect(pipe.x + 2, botY + 6, PIPE_WIDTH - 4, botH - 6);
        ctx.fillStyle = lightColor;
        ctx.fillRect(pipe.x + 4, botY + 6, 3, botH - 6);
        ctx.fillStyle = darkColor;
        ctx.fillRect(pipe.x + PIPE_WIDTH - 5, botY + 6, 3, botH - 6);
        ctx.fillStyle = mainColor;
        ctx.fillRect(pipe.x, botY, PIPE_WIDTH, 8);
        ctx.fillStyle = lightColor;
        ctx.fillRect(pipe.x, botY, PIPE_WIDTH, 2);
        ctx.fillStyle = darkColor;
        ctx.fillRect(pipe.x, botY + 6, PIPE_WIDTH, 2);
        ctx.fillStyle = rimColor;
        ctx.fillRect(pipe.x + 4, botY + 2, 2, 2);
        ctx.fillRect(pipe.x + 12, botY + 3, 3, 2);
        ctx.fillRect(pipe.x + 18, botY + 2, 2, 2);
      }
      const floorH = 12;
      ctx.fillStyle = "#78350f";
      ctx.fillRect(0, CANVAS_HEIGHT - floorH, CANVAS_WIDTH, floorH);
      ctx.fillStyle = "#b45309";
      ctx.fillRect(0, CANVAS_HEIGHT - floorH, CANVAS_WIDTH, 3);
      ctx.fillStyle = "#fde68a";
      for (let p = 0; p < CANVAS_WIDTH; p += 14) {
        ctx.fillRect(p + p % 7, CANVAS_HEIGHT - floorH + 4 + p % 5, 2, 1.5);
      }
      for (const p of sim.particles) {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        ctx.restore();
      }
      ctx.save();
      ctx.translate(OCTO_X, sim.octoY);
      ctx.rotate(sim.octoAngle);
      const octoMain = "#f43f5e";
      const octoLight = "#fb7185";
      const octoDark = "#9f1239";
      const octoBlush = "#fda4af";
      const isFlapping = sim.flapTimer > 0;
      const tentacleKick = isFlapping ? -4 : Math.sin(now * 0.012) * 2;
      ctx.fillStyle = octoDark;
      ctx.fillRect(-7, 5, 2.5, 4 + tentacleKick);
      ctx.fillRect(-3.5, 5, 2.5, 5 - tentacleKick * 0.5);
      ctx.fillRect(0, 5, 2.5, 6 + tentacleKick);
      ctx.fillRect(3.5, 5, 2.5, 5 - tentacleKick * 0.5);
      ctx.fillRect(7, 5, 2.5, 4 + tentacleKick);
      ctx.fillStyle = octoMain;
      ctx.fillRect(-6.5, 5, 2, 3 + tentacleKick);
      ctx.fillRect(-3, 5, 2, 4 - tentacleKick * 0.5);
      ctx.fillRect(0.5, 5, 2, 5 + tentacleKick);
      ctx.fillRect(4, 5, 2, 4 - tentacleKick * 0.5);
      ctx.fillRect(7.5, 5, 2, 3 + tentacleKick);
      ctx.fillStyle = octoDark;
      ctx.fillRect(-8, -6, 16, 12);
      ctx.fillRect(-7, -8, 14, 15);
      ctx.fillRect(-5, -9, 10, 17);
      ctx.fillStyle = octoMain;
      ctx.fillRect(-7, -5, 14, 10);
      ctx.fillRect(-6, -7, 12, 13);
      ctx.fillRect(-4, -8, 8, 14);
      ctx.fillStyle = octoLight;
      ctx.fillRect(-5, -7, 5, 3);
      ctx.fillRect(-4, -8, 3, 1);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, -3, 5, 6);
      ctx.fillRect(5, -2, 2, 4);
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(2, -2, 3, 4);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(2, -2, 1.5, 1.5);
      ctx.fillStyle = octoBlush;
      ctx.fillRect(-1, 3, 3, 2);
      ctx.restore();
      ctx.save();
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      for (let y = 0; y < CANVAS_HEIGHT; y += 3) {
        ctx.fillRect(0, y, CANVAS_WIDTH, 1);
      }
      ctx.restore();
      if (sim.state === "ready") {
        ctx.fillStyle = "rgba(4, 13, 22, 0.72)";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.textAlign = "center";
        ctx.font = "bold 13px monospace";
        ctx.fillStyle = "#fde047";
        ctx.fillText("FLAPPY OCTO \xB7 10s SPRINT", CANVAS_WIDTH / 2, 48);
        ctx.font = "10px monospace";
        ctx.fillStyle = "#e0f2fe";
        ctx.fillText("Survive 10 Seconds of Coral Reefs!", CANVAS_WIDTH / 2, 68);
        const blink = Math.floor(now * 3e-3) % 2 === 0;
        ctx.font = "bold 11px monospace";
        ctx.fillStyle = blink ? "#38bdf8" : "#fef08a";
        ctx.fillText("\u25B6 PRESS SPACE OR CLICK TO SWIM \u25C0", CANVAS_WIDTH / 2, 108);
        ctx.font = "9px monospace";
        ctx.fillStyle = "#94a3b8";
        ctx.fillText("Controls: [SPACE] / Click / Touch to Flap", CANVAS_WIDTH / 2, 132);
      } else if (sim.state === "playing") {
        const t = Math.max(0, sim.timeLeft).toFixed(1);
        const timerColor = sim.timeLeft <= 3 ? "#ef4444" : sim.timeLeft <= 6 ? "#f59e0b" : "#22c55e";
        const pct = Math.max(0, sim.timeLeft / SPRINT_DURATION);
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.fillRect(10, 8, 100, 7);
        ctx.fillStyle = timerColor;
        ctx.fillRect(10, 8, 100 * pct, 7);
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 1;
        ctx.strokeRect(10, 8, 100, 7);
        ctx.textAlign = "left";
        ctx.font = "bold 10px monospace";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(`\u23F1 ${t}s`, 116, 15);
        ctx.textAlign = "right";
        ctx.font = "bold 10px monospace";
        ctx.fillStyle = "#fef08a";
        ctx.fillText(`REEFS: ${sim.clearedCount}`, CANVAS_WIDTH - 12, 15);
      } else if (sim.state === "won") {
        ctx.fillStyle = "rgba(4, 25, 20, 0.78)";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.textAlign = "center";
        ctx.font = "bold 16px monospace";
        ctx.fillStyle = "#4ade80";
        ctx.fillText("\u{1F3C6} SURVIVED! 10.0s CLEARED! \u{1F3C6}", CANVAS_WIDTH / 2, 54);
        ctx.font = "11px monospace";
        ctx.fillStyle = "#fef08a";
        ctx.fillText(`Reefs Cleared: ${sim.clearedCount} \xB7 Star Surfer \u2B50\u2B50\u2B50`, CANVAS_WIDTH / 2, 78);
        const blink = Math.floor(now * 3e-3) % 2 === 0;
        ctx.font = "bold 11px monospace";
        ctx.fillStyle = blink ? "#38bdf8" : "#ffffff";
        ctx.fillText("\u25B6 PLAY AGAIN (SPACE / CLICK) \u25C0", CANVAS_WIDTH / 2, 116);
      } else if (sim.state === "gameover") {
        ctx.fillStyle = "rgba(30, 10, 15, 0.82)";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.textAlign = "center";
        ctx.font = "bold 15px monospace";
        ctx.fillStyle = "#f87171";
        ctx.fillText("\u{1F4A5} CRASHED! \u{1F4A5}", CANVAS_WIDTH / 2, 52);
        const survived = Math.max(0, SPRINT_DURATION - sim.timeLeft).toFixed(1);
        ctx.font = "11px monospace";
        ctx.fillStyle = "#fef3c7";
        ctx.fillText(`Survived: ${survived}s / 10.0s \xB7 Reefs: ${sim.clearedCount}`, CANVAS_WIDTH / 2, 74);
        const blink = Math.floor(now * 3e-3) % 2 === 0;
        ctx.font = "bold 11px monospace";
        ctx.fillStyle = blink ? "#fbbf24" : "#ffffff";
        ctx.fillText("\u25B6 TRY AGAIN (SPACE / CLICK) \u25C0", CANVAS_WIDTH / 2, 114);
      }
    };
    animId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animId);
    };
  }, [recordBestTime, spawnCrashParticles, spawnVictoryParticles]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: containerRef,
      className: "relative my-3 overflow-hidden rounded border-2 border-[#a8862f] bg-[#100c06] p-3 text-[#f4e8c8] shadow-2xl",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-center justify-between border-b border-dashed border-[#856b28] pb-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-lg", children: "\u{1F579}\uFE0F" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "font-pixel text-[9px] tracking-widest text-[#e8c170]", children: "OCTO-CADE 2026 \xB7 FLAPPY OCTO" }),
              /* @__PURE__ */ jsx("div", { className: "text-[10px] text-[#a89a76]", children: "10-SECOND REEF SURVIVAL SPRINT" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            bestTime > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 rounded border border-[#856b28] bg-[#241c10] px-2 py-0.5 font-pixel text-[8px] text-[#fde68a]", children: [
              /* @__PURE__ */ jsx(Trophy, { className: "h-3 w-3 text-[#facc15]" }),
              /* @__PURE__ */ jsxs("span", { children: [
                "BEST: ",
                bestTime.toFixed(1),
                "s"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "rounded border border-[#38bdf8]/60 bg-[#0c2233] px-2 py-0.5 font-pixel text-[8px] text-[#38bdf8]", children: "60 FPS" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "relative mx-auto aspect-[16/9] w-full max-w-[440px] cursor-pointer overflow-hidden rounded border-2 border-[#543b17] bg-[#040d16] shadow-inner select-none touch-none",
            onPointerDown: (e) => {
              if (e.button !== 0) return;
              e.preventDefault();
              e.stopPropagation();
              triggerFlap();
            },
            children: /* @__PURE__ */ jsx(
              "canvas",
              {
                ref: canvasRef,
                width: CANVAS_WIDTH,
                height: CANVAS_HEIGHT,
                className: "h-full w-full object-contain",
                style: { imageRendering: "pixelated" }
              }
            )
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-[#3a2f1a] pt-2", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: gameState === "playing" ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 font-pixel text-[9px] text-[#86efac]", children: [
            /* @__PURE__ */ jsx("span", { className: "inline-block h-2 w-2 animate-ping rounded-full bg-[#22c55e]" }),
            /* @__PURE__ */ jsxs("span", { children: [
              "SPRINT: ",
              timeLeft.toFixed(1),
              "s REMAINING"
            ] })
          ] }) : gameState === "won" ? /* @__PURE__ */ jsx("div", { className: "font-pixel text-[9px] text-[#4ade80]", children: "\u{1F389} SURVIVED THE 10s SPRINT!" }) : gameState === "gameover" ? /* @__PURE__ */ jsx("div", { className: "font-pixel text-[9px] text-[#f87171]", children: "\u{1F4A5} REEF COLLISION" }) : /* @__PURE__ */ jsx("div", { className: "font-pixel text-[9px] text-[#cdb87e]", children: "READY \xB7 TAP OR PRESS SPACE" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  triggerFlap();
                },
                className: "flex items-center gap-1.5 border-b-2 border-[#a8862f] bg-[#e8c170] px-3 py-1.5 font-pixel text-[9px] text-[#221d14] transition hover:bg-[#f5d78e] active:translate-y-[1px] active:border-b-0",
                children: gameState === "ready" ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Play, { className: "h-3 w-3" }),
                  /* @__PURE__ */ jsx("span", { children: "START SPRINT" })
                ] }) : gameState === "playing" ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Waves, { className: "h-3 w-3" }),
                  /* @__PURE__ */ jsx("span", { children: "SWIM / FLAP" })
                ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(RotateCcw, { className: "h-3 w-3" }),
                  /* @__PURE__ */ jsx("span", { children: "TRY AGAIN" })
                ] })
              }
            ),
            gameState !== "ready" && /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  resetGame();
                },
                className: "flex items-center gap-1 border border-[#6b5b33] bg-[#1a140b] px-2 py-1.5 font-pixel text-[8px] text-[#a89a76] hover:border-[#a8862f] hover:text-[#f4e8c8]",
                title: "Reset to title",
                children: [
                  /* @__PURE__ */ jsx(RotateCcw, { className: "h-2.5 w-2.5" }),
                  /* @__PURE__ */ jsx("span", { children: "RESET" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center justify-between text-[8px] text-[#8a7c58]", children: [
          /* @__PURE__ */ jsx("span", { children: "Tip: Press Spacebar or Tap anywhere on the arcade screen" }),
          /* @__PURE__ */ jsx("span", { children: "ESC to exit kiosk" })
        ] })
      ]
    }
  );
}

export { ArcadeMiniGame };

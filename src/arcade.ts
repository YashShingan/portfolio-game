"use client";

import { ArcadeMiniGame } from "@/components/game/ArcadeMiniGame";

export { ArcadeMiniGame };
export default ArcadeMiniGame;

export type GameState = "ready" | "playing" | "won" | "gameover";

export interface Pipe {
  x: number;
  gapY: number;
  passed: boolean;
  colorType: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  life: number;
  maxLife: number;
}

export interface Bubble {
  x: number;
  y: number;
  speed: number;
  radius: number;
  wiggleOffset: number;
  alpha: number;
}

export interface ArcadeMiniGameProps {
  onComplete?: () => void;
  className?: string;
}

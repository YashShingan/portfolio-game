import * as react from 'react';

declare function ArcadeMiniGame(): react.JSX.Element;

type GameState = "ready" | "playing" | "won" | "gameover";
interface Pipe {
    x: number;
    gapY: number;
    passed: boolean;
    colorType: number;
}
interface Particle {
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
interface Bubble {
    x: number;
    y: number;
    speed: number;
    radius: number;
    wiggleOffset: number;
    alpha: number;
}
interface ArcadeMiniGameProps {
    onComplete?: () => void;
    className?: string;
}

export { ArcadeMiniGame, ArcadeMiniGame as default };
export type { ArcadeMiniGameProps, Bubble, GameState, Particle, Pipe };

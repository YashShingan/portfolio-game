"use client";

import React, { useState } from "react";
import { GameOverlay } from "@/components/game/GameOverlay";
import { portfolio } from "@/config/portfolio";

export interface PortfolioGameProps {
  /** Initial visibility state of the game. Defaults to true. */
  open?: boolean;
  /** Callback triggered when the player exits the game overlay */
  onClose?: () => void;
  /** Optional class name for the wrapper */
  className?: string;
  /** Optional portfolio configuration override */
  config?: typeof portfolio;
}

export function PortfolioGame({
  open = true,
  onClose,
  className,
}: PortfolioGameProps): React.JSX.Element | null {
  const [isOpen, setIsOpen] = useState(open);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  if (!isOpen) return null;

  return React.createElement(
    "div",
    { className },
    React.createElement(GameOverlay, { open: isOpen, onClose: handleClose })
  );
}

export default PortfolioGame;

// Core sub-component & configuration exports
export { GameOverlay } from "@/components/game/GameOverlay";
export { portfolio } from "@/config/portfolio";
export { audio, ChiptuneEngine } from "@/game/systems/audio";
export { createGame } from "@/game/main";
export { Joystick } from "@/components/game/Joystick";
export { sharedInput, gameRuntime, resetSharedState, pixelFont } from "@/game/systems/shared";
export { ArcadeMiniGame } from "@/components/game/ArcadeMiniGame";

// Re-export all type declarations
export * from "./types";

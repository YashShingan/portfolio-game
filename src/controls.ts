"use client";

import { Joystick } from "@/components/game/Joystick";
import { sharedInput, gameRuntime, resetSharedState, pixelFont } from "@/game/systems/shared";

export { Joystick, sharedInput, gameRuntime, resetSharedState, pixelFont };
export default Joystick;

export interface SharedInput {
  x: number;
  y: number;
}

export interface GameRuntime {
  modalOpen: boolean;
  interactQueued: boolean;
}

export interface JoystickProps {
  className?: string;
}

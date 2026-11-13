"use client";

import { useTypewriter, Dialogue } from "@/components/game/ZoneModal";

export { useTypewriter, Dialogue };
export default Dialogue;

export type DialogueProps = {
  npcId: string;
  onClose: () => void;
};

export type TypewriterResult = {
  shown: string;
  done: boolean;
  finish: () => void;
};

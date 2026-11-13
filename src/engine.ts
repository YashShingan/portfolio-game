import { createGame } from "@/game/main";
import { BootScene } from "@/game/scenes/BootScene";
import { WorldScene } from "@/game/scenes/WorldScene";
import { Player } from "@/game/entities/Player";
import { NPC } from "@/game/entities/NPC";
import { Ghost, type GhostSpawn } from "@/game/entities/Ghost";
import { GhostSystem, ghosts, type GhostPos } from "@/game/systems/ghosts";
import * as ground from "@/game/systems/ground";
import * as events from "@/game/systems/events";
import * as world from "@/game/data/world";

export {
  createGame,
  BootScene,
  WorldScene,
  Player,
  NPC,
  Ghost,
  GhostSystem,
  ghosts,
  ground,
  events,
  world,
};

export type { GhostSpawn, GhostPos };
export default createGame;

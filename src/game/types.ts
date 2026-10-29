/**
 * Shared types between the Phaser game and the React shell.
 * Kept free of any Phaser imports so both sides can use them.
 */

export type ZoneKind =
  | "welcome"
  | "about"
  | "project"
  | "skills"
  | "contact"
  | "dialogue"
  | "secret";

export interface ZonePayload {
  kind: ZoneKind;
  /** Zone identifier — also used for visit tracking & achievements */
  id: string;
  title: string;
  subtitle?: string;
  /** For dialogue NPCs */
  npcId?: string;
  /** For project zones: the project id in the config */
  projectId?: string;
  /** For skill zones: the skill group id */
  skillId?: string;
}

export interface AchievementDef {
  id: string;
  title: string;
  desc: string;
  emoji: string;
}

import type { Memory } from "@/lib/types";

/**
 * The photographs on the wall — positions, tilt and tape for ten cards.
 *
 * `x` and `y` are per cent of the memory board, which scales as one unit, so
 * every card keeps its exact relationship to every other at any window size.
 */
const slots: Array<Pick<Memory, "tint" | "rotate" | "x" | "y" | "z">> = [
  { tint: "#8A6A4A", rotate: 4, x: -5, y: 66, z: 5 },
  { tint: "#8A7A70", rotate: -5, x: 18, y: 20, z: 10 },
  { tint: "#8C99A2", rotate: -6, x: 22, y: 79, z: 4 },
  { tint: "#C77E92", rotate: -5, x: 39, y: 27, z: 9 },
  { tint: "#C0876C", rotate: 5, x: 47, y: 67, z: 3 },
  { tint: "#6E9B96", rotate: 2, x: 59, y: 16, z: 8 },
  { tint: "#B9B2AC", rotate: 4, x: 66, y: 82, z: 2 },
  { tint: "#5F7E63", rotate: 4, x: 77, y: 29, z: 7 },
  { tint: "#D4A24A", rotate: -5, x: 93, y: 22, z: 1 },
  { tint: "#8F7A66", rotate: 4, x: 85, y: 72, z: 6 },
];

const scenes = ["path", "window", "sea", "field", "hills", "night"] as const;

export const memories: Memory[] = slots.map((slot, i) => ({
  id: `memory-${i + 1}`,
  caption: `memory ${i + 1}`,
  note: "A note for this memory.",
  scene: scenes[i % scenes.length],
  tape: "top",
  ...slot,
}));

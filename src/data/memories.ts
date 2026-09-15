import { memories as content } from "@/content/memories";
import type { Memory } from "@/lib/types";

/**
 * The photographs on the wall.
 *
 * Ten of them, spread across the painted wall, and **no two of them touch**.
 *
 * **`x` and `y` are per cent of the memory board, not of the room.** The board
 * is a fixed 1.6:1 panel that scales as a single unit (see `--board-w` in
 * globals.css), so these numbers are a drawing rather than a layout: every
 * photograph keeps its exact relationship to every other one at any window size.
 *
 * ## How it is arranged
 *
 * A **staggered walk from left to right** across two bands — five high on the
 * wall, five low — that alternate, so neighbours pass each other while the cards
 * themselves stay a clear band of wall apart. That alternation is the whole
 * trick: it lets ten photographs be big, evenly spread, and never once cover one
 * another.
 *
 * Two rules keep it from looking like a grid: **neither band is a level line**
 * (the high ones ride 16–29, the low ones 66–82), and **no two gaps are the
 * same**, across or down. Tilt does the rest — −6° to +5°, no two alike.
 *
 * The coordinates are tuned to the painted backdrop (`Backdrop`): everything
 * lives in the left ~75% of the wall, clear of the window (top-left) and the
 * shelf, clock and lamp painted into the right of the plate. `above the clouds`
 * is the quiet anchor — the straightest card, with the most bare wall around it.
 *
 * `z` decides nothing at rest (nothing overlaps); it is kept ordered
 * high-on-the-wall-first as a tie-break.
 *
 * ## Where the words and pictures live
 *
 * Not here. This file is only the arrangement: ten slots, each with a place,
 * a tilt and a default tint. What goes in them — captions, notes, photos —
 * is in `src/content/memories.ts`, matched to the slots in order.
 */
const slots: Array<Pick<Memory, "tint" | "rotate" | "tape" | "x" | "y" | "z">> = [
  /* Low band, far left — fills the wall under the window and holds the bottom
     corner down. */
  { tint: "#8A6A4A", rotate: 4, tape: "top", x: -5, y: 66, z: 5 },
  /* First on the high walk, up where the eye comes in. */
  { tint: "#8A7A70", rotate: -5, tape: "top", x: 18, y: 20, z: 10 },
  /* Low band — a still lake to break the gutter under the first. */
  { tint: "#8C99A2", rotate: -6, tape: "top", x: 22, y: 79, z: 4 },
  /* Middle of the high band, and roughly the middle of the wall. */
  { tint: "#B48893", rotate: -5, tape: "top", x: 39, y: 27, z: 9 },
  /* Low band, dead centre — the bridge across the empty middle of the wall. */
  { tint: "#B68E79", rotate: 5, tape: "top", x: 47, y: 67, z: 3 },
  /* The anchor: the strongest image, the straightest card (2°), with the widest
     margin of bare wall. It sits right of centre so the wall never settles into
     the middle. */
  { tint: "#6E9B96", rotate: 2, tape: "top", x: 59, y: 16, z: 8 },
  /* Low band, right of centre. */
  { tint: "#A3AE7C", rotate: 4, tape: "top", x: 66, y: 82, z: 2 },
  /* High band, out toward the right. */
  { tint: "#5F8A96", rotate: 4, tape: "top", x: 77, y: 29, z: 7 },
  /* High band, far right — the quietest picture. */
  { tint: "#D4A24A", rotate: -5, tape: "top", x: 93, y: 22, z: 1 },
  /* The end of the walk: bottom-right, the last stop — it leads the eye down
     toward the letter on the desk. */
  { tint: "#8F7A66", rotate: 4, tape: "top", x: 85, y: 72, z: 6 },
];

/** Content laid onto the slots, in order. Anything past the tenth is ignored. */
export const memories: Memory[] = content.slice(0, slots.length).map((item, i) => ({
  id: `memory-${i + 1}`,
  ...slots[i],
  ...item,
  tint: item.tint ?? slots[i].tint,
}));

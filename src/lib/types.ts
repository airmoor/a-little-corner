export type TapeStyle = "top" | "corner-tl" | "corner-tr" | "double";

/** The little gouache illustration painted into a memory's frame. */
export type SceneKind =
  | "hills"
  | "night"
  | "path"
  | "sea"
  | "field"
  | "window"
  | "mountains"
  | "lake"
  | "rain"
  | "cup";

/**
 * A single memory pinned to the wall.
 *
 * `image` is optional so the wall can be built and felt before the real
 * photographs arrive — a warm placeholder tint stands in until then.
 */
export interface Memory {
  id: string;
  /** Handwritten caption shown under the photo, e.g. "Lisbon, 2026". */
  caption: string;
  /** The longer note revealed when a memory is opened. */
  note: string;
  /** Path to a photo in /public, e.g. "/memories/lisbon.jpg". Optional. */
  image?: string;
  /** Warm tint used as a placeholder (and as a mat behind the photo). */
  tint: string;
  /** Which hand-painted scene fills the frame until a real photo arrives. */
  scene?: SceneKind;
  /** Resting rotation on the wall, in degrees. Small and imperfect. */
  rotate: number;
  /** How the tape holds this photo to the wall. */
  tape: TapeStyle;
  /**
   * Where it hangs, as percentages of **the memory board** — one rigid panel
   * that scales as a unit, so this is the position at every window size rather
   * than a desktop-only arrangement. See `memories.ts`.
   */
  x: number;
  y: number;
  /**
   * Stacking order. Nothing on the board overlaps anything any more, so this
   * decides nothing at rest — it is kept, ordered highest-on-the-wall-first, as
   * a tie-break in case a nudge ever brings two corners together.
   */
  z: number;
}

"use client";

import {
  animate,
  useMotionValue,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Memory } from "@/lib/types";

/**
 * The camera rig.
 *
 * The room is a single fixed scene — nothing scrolls, ever. Opening something
 * in it is not a modal, it's a slow dolly-in. One `push` value (0 = standing
 * back looking at the room, 1 = arrived) drives every layer: the room scales up
 * around whatever was touched, the light drains out of everything else, and the
 * thing itself is drawn out to the viewer. Each layer reads the same value, so
 * everything moves as one breath.
 *
 * Only `transform` and `opacity` are ever animated. Nothing animates a filter:
 * blur has to re-rasterize the layer every frame, and this scene is built out of
 * SVG filters (`.torn`, `#gouache`) and blend modes, which makes that ruinously
 * expensive.
 */

// A long, even ease — slow to leave, slow to settle. Never springs, never
// snaps. This is the whole feel of the piece, so it lives in one place.
export const CALM: [number, number, number, number] = [0.33, 0.03, 0.2, 1];

// The camera takes its time getting there, and a touch less coming back.
export const PUSH_IN = 1.5;
export const PUSH_OUT = 1.15;

/**
 * How far the room travels — the scene's scale at full push.
 *
 * It lives here, next to the measuring, rather than in CameraStage: once the
 * camera is moving, anything in the room is measured *through* this scale, and
 * `measureFocusable` has to divide it back out again.
 */
export const STAGE_SCALE = 2.35;

/**
 * Something in the room exactly as it is drawn, in viewport pixels: where its
 * centre is, how wide it comes out, and how far over it's leaning.
 *
 * A photograph taken off the wall has to leave from *this*, not from its
 * resting layout — at the moment of the click it is usually lifted, enlarged
 * and straightened by its hover, and drifting a little on top of that. Starting
 * anywhere else makes it jump the instant it takes off.
 */
export interface Box {
  cx: number;
  cy: number;
  width: number;
  rotate: number;
}

/**
 * What the camera has been sent to look at.
 *
 * A photograph is carried off the wall and held up; the envelope on the desk is
 * left where it lies and its letter unfolds instead. Both are the same shot —
 * the room pushes in, the light narrows — so both go through this one rig.
 */
export type FocusTarget =
  | { kind: "memory"; memory: Memory }
  | { kind: "letter" };

/** The `data-focus` attribute the camera measures a target from. */
export const ENVELOPE_ID = "envelope";

export function focusId(target: FocusTarget): string {
  return target.kind === "memory" ? target.memory.id : ENVELOPE_ID;
}

/** What the target is leaning at rest — the sign a box alone can't recover. */
function focusRotate(target: FocusTarget): number {
  return target.kind === "memory" ? target.memory.rotate : 0;
}

export interface Focus {
  target: FocusTarget;
  /** Where the thing was in the room, as drawn, at the moment of the click. */
  box: Box;
}

/** Where the camera stands when a measurement has to be taken mid-shot. */
export interface CameraAt {
  focus: Focus;
  push: number;
}

/**
 * Measure something in the room. Null if it isn't mounted.
 *
 * `getBoundingClientRect()` on a tilted card gives its axis-aligned box, not
 * its layout box — a card at -6deg reports ~15% wider than it is. But every
 * transform between the card and the viewport (its tilt, its hover, the room's
 * ambient drift, the pan, the camera's own push) is a rotation, a uniform scale
 * or a translation, so what lands on screen is always the layout box turned and
 * scaled about its centre. With the layout size w x h — `offsetWidth/Height`,
 * immune to transforms — and the drawn box W x H, that gives
 *
 *   W = |u| w + |v| h        u = s·cos0
 *   H = |v| w + |u| h        v = s·sin0
 *
 * a pair inverted below to recover the drawn scale and tilt. The magnitude of
 * the tilt is all the box can tell us — a card leaning left covers exactly the
 * box of one leaning right — so its direction comes from `restRotate`, which is
 * what everything on the card is leaning around.
 *
 * A measurement taken mid-shot is also being taken *through* the camera: the
 * stage is scaling the whole room, so a 160px card reports 376px at full push.
 * Passing `at` divides that back out. The stage scales about the focused
 * thing's centre, so that point stands still in the viewport and every offset
 * from it, and every size, is simply the stage's scale too large.
 */
export function measureFocusable(
  id: string,
  restRotate: number,
  at?: CameraAt,
): Box | null {
  const el = document.querySelector<HTMLElement>(
    `[data-focus="${CSS.escape(id)}"]`,
  );
  if (!el) return null;

  const r = el.getBoundingClientRect();
  const w = el.offsetWidth;
  const h = el.offsetHeight;
  const det = w * w - h * h;

  // A square element carries no trace of its own turn — the two unknowns
  // collapse. Nothing that is carried anywhere is square (a photograph is
  // half again as tall as it is wide), and the one target that could be, the
  // envelope, is only ever used for its centre, so an approximation is enough.
  const square = Math.abs(det) < 1;
  const u = square ? r.width / w : (w * r.width - h * r.height) / det;
  const v = square ? 0 : (w * r.height - h * r.width) / det;

  const drawn = Math.hypot(u, v);
  const tilt = square
    ? Math.abs(restRotate)
    : Math.atan2(v, u) * (180 / Math.PI);

  const box: Box = {
    // Rotation and scale both work about the centre, so the drawn box's centre
    // is the element's centre however it's turned.
    cx: r.left + r.width / 2,
    cy: r.top + r.height / 2,
    width: w * drawn,
    rotate: restRotate < 0 ? -tilt : tilt,
  };
  if (!at) return box;

  const scale = 1 + (STAGE_SCALE - 1) * at.push;
  const px = at.focus.box.cx;
  const py = at.focus.box.cy;
  return {
    cx: px + (box.cx - px) / scale,
    cy: py + (box.cy - py) / scale,
    width: box.width / scale,
    rotate: box.rotate,
  };
}

/** idle → pushing (camera moving in) → page (note unfolded) → closing (pulling back). */
export type Phase = "idle" | "pushing" | "page" | "closing";

interface CameraValue {
  push: MotionValue<number>;
  focus: Focus | null;
  phase: Phase;
  /** True whenever the camera is in motion or held at its target. */
  active: boolean;
  /** The id currently drawn out to the viewer — its twin in the room hides so there's no double. */
  focusedId: string | null;
  reduced: boolean;
  open: (target: FocusTarget) => void;
  close: () => void;
}

const CameraContext = createContext<CameraValue | null>(null);

export function useCamera(): CameraValue {
  const value = useContext(CameraContext);
  if (!value) throw new Error("useCamera must be used within a CameraProvider");
  return value;
}

export function CameraProvider({ children }: { children: ReactNode }) {
  const push = useMotionValue(0);
  const [focus, setFocus] = useState<Focus | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const reduced = useReducedMotion() ?? false;
  // Bumped on every open/close so a superseded animation's completion is ignored.
  const gen = useRef(0);

  const open = useCallback(
    (target: FocusTarget) => {
      // Ignore a second click while something is already in view.
      if (focus) return;

      const box = measureFocusable(focusId(target), focusRotate(target));
      if (!box) return;

      setFocus({ target, box });
      setPhase("pushing");

      const token = ++gen.current;
      push.set(0);
      animate(push, 1, {
        duration: reduced ? 0.001 : PUSH_IN,
        ease: CALM,
      }).then(() => {
        if (gen.current === token) setPhase("page");
      });
    },
    [focus, push, reduced],
  );

  const close = useCallback(() => {
    const token = ++gen.current;
    setPhase("closing");
    // Let the note begin folding away before the room starts pulling back.
    animate(push, 0, {
      duration: reduced ? 0.001 : PUSH_OUT,
      ease: CALM,
      delay: reduced ? 0 : 0.12,
    }).then(() => {
      if (gen.current !== token) return;
      setFocus(null);
      setPhase("idle");
    });
  }, [push, reduced]);

  const active = phase !== "idle";

  /*
   * Hold the room still for the length of the shot.
   *
   * A dozen infinite transform animations (each with will-change) competing
   * with the push is work the compositor doesn't need to do mid-shot, and the
   * room is scaling past the viewer anyway. The scene itself never scrolls — it
   * is one fixed stage — so unlike the old scrolling wall there is nothing here
   * to lock; the pan reads `active` and simply stops accepting the drag.
   */
  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    root.classList.add("camera-active");
    return () => root.classList.remove("camera-active");
  }, [active]);

  const value = useMemo<CameraValue>(
    () => ({
      push,
      focus,
      phase,
      active,
      focusedId: active && focus ? focusId(focus.target) : null,
      reduced,
      open,
      close,
    }),
    [push, focus, phase, active, reduced, open, close],
  );

  return (
    <CameraContext.Provider value={value}>{children}</CameraContext.Provider>
  );
}

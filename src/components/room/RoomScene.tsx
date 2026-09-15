"use client";

import { useState } from "react";
import { memories } from "@/data/memories";
import { letter } from "@/content/letter";
import { motion } from "framer-motion";
import PolaroidCard from "../PolaroidCard";
import { CALM, ENVELOPE_ID, useCamera } from "../camera/CameraProvider";
import Backdrop from "./Backdrop";
import Prop from "./Prop";
import Envelope from "./art/Envelope";

/**
 * A little room of memories — one directed shot of it.
 *
 * The room itself is a single painted plate (`Backdrop`): the wall, the floor,
 * the window, the shelf, the clock, the desk and everything on it are pixels,
 * not live SVG. The scene is built out of exactly three layers:
 *
 *   the backdrop   the whole room, as one flat image, on the camera's dolly
 *   the board      the photographs, hung across the wall — live, and openable
 *   the letter     lying on the desk, in front of the envelope drawn in the plate
 *
 * Only the two things that *open* are still drawn as elements, because only they
 * have to be measured, carried and handed back. Everything else was scenery, and
 * scenery that never moves on its own belongs in the plate.
 *
 * Placement is by percentage, so the board and the letter sit at fixed spots on
 * the plate and the camera can measure either the same way.
 */
export default function RoomScene() {
  const { open, reduced } = useCamera();

  // The focus-rack releases its blur once, on arrival. After it settles we drop
  // the filter to `none` — a lingering `blur(0px)` still forces the photo layer
  // to re-rasterize every frame the camera pushes in, which is exactly the
  // stutter CameraStage was rebuilt to avoid. Cleared, it costs nothing at rest.
  const [settled, setSettled] = useState(false);

  return (
    /* ——— the room arrives, whole —————————————————————————————————————
       The photographs are stuck up before you get here, so nothing deals itself
       out one at a time. The wall, the photos and the letter come up together as
       one — a plain opacity fade, which composites the already-painted layer
       rather than recomputing its filters each frame. */
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={reduced ? { duration: 0.001 } : { duration: 0.9, ease: CALM }}
    >
      {/* The room, painted. */}
      <Backdrop />

      {/* ——— the photographs ————————————————————————————————————————
          Live cards on their own plane, over the painted wall. The board is a
          fixed 1.6:1 rectangle (see `--board-w` in globals.css); each card is a
          fraction of it, so the arrangement holds its shape at any size. */}
      <div className="plane absolute inset-0" style={{ zIndex: 10 }}>
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: "48%", top: "36%", width: "var(--board-w)", height: "var(--board-h)" }}
        >
          {/* Focus-rack on the photographs alone — they resolve from soft to
              sharp as the room comes up, the one bit of "the eye adjusting" that
              idea 2 was after. Only the photo layer carries it (no painted-plate
              SVG filters here), and it is cleared to `none` the moment it lands. */}
          <motion.div
            className="absolute inset-0"
            initial={reduced ? { filter: "none" } : { filter: "blur(14px)" }}
            animate={{ filter: reduced || settled ? "none" : "blur(0px)" }}
            transition={reduced ? { duration: 0.001 } : { duration: 0.95, ease: CALM }}
            onAnimationComplete={() => setSettled(true)}
          >
            {memories.map((memory, i) => (
              <div
                key={memory.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${memory.x}%`, top: `${memory.y}%`, zIndex: memory.z }}
              >
                <div
                  className="breathe"
                  style={{
                    animationDuration: `${9 + i * 1.3}s`,
                    animationDelay: `${-i * 2.3}s`,
                  }}
                >
                  <PolaroidCard memory={memory} />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ——— the letter ——————————————————————————————————————————————
          The one object in the room that opens from the desk. It sits over the
          envelope painted into the plate, on the near part of the tabletop, a
          little left of centre. `letter-wait` gives it its two-pixel breath. */}
      <div className="plane absolute inset-0" style={{ zIndex: 20 }}>
        <Prop
          style={{ left: "43.5%", top: "82%", width: "13%", zIndex: 3 }}
          className="letter-wait"
          label={letter.label}
          focusId={ENVELOPE_ID}
          onActivate={() => open({ kind: "letter" })}
        >
          <Envelope className="h-auto w-full" />
        </Prop>
      </div>
    </motion.div>
  );
}

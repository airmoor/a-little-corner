"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Memory } from "@/lib/types";
import { CALM, useCamera } from "./camera/CameraProvider";
import PolaroidFace from "./PolaroidFace";
import Tape from "./Tape";

/**
 * True only for a pointer that can actually hover — a mouse or a trackpad.
 *
 * A finger cannot hover, and pretending it can breaks the flight. The lift is
 * triggered by the very same tap that opens the memory, so the camera measures
 * the card mid-spring: part-raised, part-straightened and a few percent too
 * large. The photograph then takes off from a place it isn't, and the hand-off
 * between the wall card and the one in flight jumps. Left off touch, the card
 * is measured exactly where it is drawn.
 */
function useHoverPointer() {
  const [hoverable, setHoverable] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setHoverable(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return hoverable;
}

interface PolaroidCardProps {
  memory: Memory;
}

/**
 * The tape's own clock — it does not ride the camera.
 *
 * Going: the photograph is peeled away and the strip is left holding nothing,
 * so it lets go a beat later. `CALM` starts slowly, which is what buys that
 * beat: the tape is still there as the photo lifts, then releases.
 *
 * Coming back: nothing at all until the photograph has landed. The card is
 * released from `focused` on the frame its flight ends, so the delay here is
 * measured from a photo already at rest — it is pressed back down onto a
 * picture that has stopped moving, never onto one still arriving.
 */
const TAPE_OFF = { duration: 0.4, ease: CALM };
const TAPE_ON = { duration: 0.55, ease: CALM, delay: 0.14 };

export default function PolaroidCard({ memory }: PolaroidCardProps) {
  const { open, focusedId, reduced } = useCamera();
  const hoverable = useHoverPointer();

  // While this photo is the one drawn out to the viewer, its wall twin waits,
  // invisible but still holding its place — so the hero returns to an exact spot.
  const focused = focusedId === memory.id;

  return (
    <motion.button
      type="button"
      /* The camera measures the flight from this element — the card exactly as
         it is drawn, hover lift, ambient drift and all. */
      data-focus={memory.id}
      /* No entrance of its own. The photograph is already stuck to the wall
         before the viewer arrives; the board it lives on owns the reveal (see
         RoomScene). Here the card simply rests at its crooked angle from the
         first paint — `initial={false}` snaps to that tilt without animating —
         so hover can spring away from it and settle back. */
      initial={false}
      animate={{ rotate: memory.rotate }}
      onClick={() => open({ kind: "memory", memory })}
      whileHover={
        hoverable
          ? {
              y: -10,
              scale: 1.03,
              rotate: memory.rotate * 0.35,
              transition: { type: "spring", stiffness: 240, damping: 18 },
            }
          : undefined
      }
      whileTap={{ scale: 0.99 }}
      /* The card's width comes from the room — `--wall-card-w` is set on
         `.scene` against both the room's width and its height, so a photograph
         is the right size for the wall it hangs on rather than for the browser
         window. Every other measurement on the face is a fraction of it.

         `touch-action: manipulation` keeps a quick second tap on a photo from
         being read as a double-tap to zoom: the room is full of things you tap,
         and waiting to find out is what makes a touch feel unresponsive. */
      className="group relative block cursor-pointer touch-manipulation outline-none [--card-w:var(--wall-card-w)] focus-visible:ring-2 focus-visible:ring-terracotta/70 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
      aria-label={`Open memory: ${memory.caption}`}
    >
      <PolaroidFace
        memory={memory}
        photoHidden={focused}
        tape={
          /* Stuck to the wall, not to the flight: the strip stays here, at
             full size, while the photograph is carried off. `initial={false}`
             so it is simply present on the first paint — it fades up with the
             card, which is already fading up around it, rather than twice. */
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 block"
            initial={false}
            animate={{ opacity: focused ? 0 : 1 }}
            transition={reduced ? { duration: 0.001 } : focused ? TAPE_OFF : TAPE_ON}
          >
            <Tape style={memory.tape} />
          </motion.span>
        }
      />
    </motion.button>
  );
}

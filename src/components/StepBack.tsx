"use client";

import type { Ref } from "react";
import { motion } from "framer-motion";
import { CALM } from "./camera/CameraProvider";

/**
 * The way back into the room, tucked under the corner of whatever is open.
 *
 * Pinned to the sheet rather than to the screen: out in the corner of the
 * viewport it floated in mid-air, landing on whichever part of the room happened
 * to be behind it and belonging to nothing. Here it reads as a scrap slipped
 * under the page — and it arrives and leaves with that page, since it rides the
 * same unfold.
 *
 * A torn scrap, not a disc. A white circle was the one machine-made shape in a
 * room of torn edges and tape, which is exactly what made it look pasted in
 * from another app.
 */
export default function StepBack({
  ref,
  onClick,
  shown,
  reduced,
}: {
  ref?: Ref<HTMLButtonElement>;
  onClick: () => void;
  shown: boolean;
  reduced: boolean;
}) {
  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label="Step back into the room"
      initial={false}
      animate={{ opacity: shown ? 1 : 0 }}
      transition={{ duration: reduced ? 0.001 : 0.6, ease: CALM }}
      className="absolute -right-4 -top-5 z-20 flex h-11 w-11 -rotate-6 items-center justify-center text-ink-soft outline-none transition hover:text-ink hover:brightness-105 focus-visible:ring-2 focus-visible:ring-terracotta/70 focus-visible:ring-offset-2"
    >
      {/* The paper it was torn from, kept behind the mark: the deckle filter
          roughs up the edge of whatever it touches, so the cross laid on top
          stays crisp — the same split the sheet itself uses. */}
      <span aria-hidden className="paper torn-sm absolute inset-1" />

      {/* Drawn rather than typed. A text "×" hangs off the typewriter face's
          math axis — above the optical centre — and its straight, square-ended
          strokes belong to no other mark in this room. Two barely-bowed pen
          strokes with round ends sit centred by their own box, and read as
          something someone put there by hand. */}
      <svg
        viewBox="0 0 16 16"
        className="relative h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        aria-hidden
        focusable="false"
      >
        <path d="M4.4 4.2 Q8.2 8.4 11.7 11.8" />
        <path d="M11.8 4.3 Q7.8 7.7 4.2 11.9" />
      </svg>
    </motion.button>
  );
}

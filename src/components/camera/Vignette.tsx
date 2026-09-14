"use client";

import { motion, useTransform } from "framer-motion";
import { useCamera } from "./CameraProvider";

/**
 * The light narrowing onto whatever the camera went to see.
 *
 * A warm dark wash over the room, transparent at the point of arrival and deep
 * at the edges — so the memory (or the letter) sits in the one lit part of the
 * scene. It is also the way back out: the whole sheet is the button that steps
 * you back into the room.
 *
 * Its opacity is `push` itself rather than a second animated value. The two
 * were always driven with identical durations, easings and delays, so there was
 * never anything for a separate clock to say.
 */
export default function Vignette() {
  const { push, focus, phase, close } = useCamera();

  const opacity = useTransform(push, [0, 1], [0, 1]);

  if (!focus) return null;

  return (
    <motion.button
      type="button"
      aria-label="Step back into the room"
      onClick={() => {
        if (phase === "pushing" || phase === "page") close();
      }}
      style={{
        opacity,
        /*
         * The light pool is centred on the screen, not on the thing that was
         * touched — because that is where the thing ends up. A photograph is
         * carried to the middle and a letter unfolds there, so aiming the clear
         * part at the spot on the wall (or at the envelope on the desk) lit an
         * empty corner and left the memory itself in the dark half. The camera
         * still pushes toward the object; only the light is centred.
         *
         * The extents are deliberately smaller than the screen. A radial
         * gradient sizes its stops against these percentages, so at the 130% it
         * started out with, the 38% stop landed ~700px out and the room never
         * actually got dark — the wall behind stayed bright enough to compete
         * with the photograph in front of it.
         *
         * Even the centre is no longer clear. The room is pushed in behind the
         * memory, so its neighbours sit right next to it at nearly the same
         * size; left lit, they read as a second card opened alongside. Blur
         * would separate them better but would re-rasterise the scaled room
         * every frame, so the separation is done with light alone.
         */
        background:
          "radial-gradient(72% 64% at 50% 50%, rgba(24,16,7,0.42) 0%, rgba(24,16,7,0.68) 46%, rgba(18,12,4,0.94) 100%)",
      }}
      /* This sheet covers the whole screen, so it is where a stray drag lands.
         Swallowing the gesture keeps a touch from rubber-banding the page or
         reaching the room's pan behind it. */
      className="fixed inset-0 z-40 cursor-zoom-out touch-none"
    />
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CALM, useCamera } from "../camera/CameraProvider";

/**
 * The one line of instruction the room gets.
 *
 * A scene you explore has to admit, once, that it can be explored — nothing in a
 * paper collage looks like a button. So a small typewritten line waits a couple
 * of seconds, says what there is to do, and then leaves for good the moment the
 * first thing is opened. It never comes back.
 *
 * It names the letter rather than offering the room. "Open what you like" was an
 * invitation to go hunting, which is the behaviour the redesign was trying to
 * stop: the composition spends everything it has pointing at one object, and the
 * only line of type in the scene should not then send the eye off looking for
 * others. The wall is found afterwards, on the way back out of the letter — which
 * is the right order for it to be found in.
 *
 * On a screen too narrow to hold the whole room it also mentions the drag,
 * because the sides of the room are genuinely out of sight there. That breakpoint
 * is `--room-w`'s own floor: below 54rem the room overflows, which is exactly
 * when `PanLayer` starts accepting a drag.
 */
export default function RoomHint() {
  const { focus } = useCamera();
  const [found, setFound] = useState(false);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    if (focus) setFound(true);
  }, [focus]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 54rem)");
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <motion.p
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: found ? 0 : 1 }}
      transition={{
        duration: found ? 0.7 : 1.4,
        delay: found ? 0 : 2.2,
        ease: CALM,
      }}
      /* Capped and centred rather than edge to edge: with this much letter
         tracking the two-clause version runs the full width of a phone, and a
         line of type touching both edges reads as chrome bolted to the screen
         rather than something written under the room. */
      /* Warm paper rather than ink: the grade takes the bottom of the frame down
         to near-black now, and the line was set in a colour chosen for a bright
         plaster floor — it disappeared into the dark it is sitting on. */
      className="pointer-events-none fixed inset-x-0 bottom-[max(0.9rem,env(safe-area-inset-bottom))] z-30 mx-auto max-w-[20rem] text-balance px-4 text-center font-type text-[0.58rem] uppercase leading-relaxed tracking-[0.22em] text-paper/55"
    >
      {narrow ? "drag to look around · open the letter" : "there is a letter on the desk"}
    </motion.p>
  );
}

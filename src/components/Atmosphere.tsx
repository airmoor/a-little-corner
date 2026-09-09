"use client";

import type { CSSProperties } from "react";

/**
 * The air in the room — the glass, really.
 *
 * Paper grain and a little dust turning in the light. This layer sits over
 * *everything* — the room, the vignette, the photograph being held up — and it
 * never moves, because the camera moving through a scene while the grain sits
 * still on the glass is a large part of why a flat collage reads as having depth.
 *
 * The lighting itself used to live here too, and no longer does: how the room is
 * lit belongs to `Grade`, which fades out when the camera takes over. What is
 * left here is only what should still be true of a photograph held up to the
 * viewer — the grain of the paper, and the dust between them.
 *
 * It is also the cheapest possible way to get that: no filters animate, nothing
 * re-rasterizes, and the layer takes no pointer events at all.
 */

/**
 * Dust motes — hand-placed so they never re-render differently on the client.
 *
 * Gathered along the beam from the window rather than spread evenly over the
 * screen. Dust is only ever visible where the light catches it, and a mote
 * turning in the dark half of the frame is a white dot; a drift of them running
 * diagonally down toward the desk is the light itself becoming visible.
 */
const MOTES = [
  { left: "12%", top: "26%", size: 4, dur: 31, delay: -3, o: 0.16, x: "22px", y: "-150px" },
  { left: "20%", top: "40%", size: 5, dur: 26, delay: -14, o: 0.2, x: "-18px", y: "-170px" },
  { left: "28%", top: "52%", size: 4, dur: 34, delay: -8, o: 0.15, x: "24px", y: "-140px" },
  { left: "36%", top: "62%", size: 6, dur: 24, delay: -20, o: 0.22, x: "-16px", y: "-130px" },
  { left: "44%", top: "70%", size: 4, dur: 29, delay: -5, o: 0.18, x: "20px", y: "-160px" },
  { left: "52%", top: "56%", size: 5, dur: 37, delay: -17, o: 0.17, x: "-22px", y: "-180px" },
  { left: "58%", top: "68%", size: 3, dur: 27, delay: -25, o: 0.14, x: "18px", y: "-150px" },
  { left: "31%", top: "34%", size: 3, dur: 39, delay: -11, o: 0.12, x: "26px", y: "-190px" },
];

export default function Atmosphere() {
  return (
    <div aria-hidden className="grain pointer-events-none fixed inset-0 z-[60]">
      {MOTES.map((m, i) => (
        <span
          key={i}
          className="mote"
          style={
            {
              left: m.left,
              top: m.top,
              width: m.size,
              height: m.size,
              "--mote-dur": `${m.dur}s`,
              "--mote-o": m.o,
              "--mote-x": m.x,
              "--mote-y": m.y,
              animationDelay: `${m.delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

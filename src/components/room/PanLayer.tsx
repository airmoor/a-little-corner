"use client";

import { motion, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useCamera } from "../camera/CameraProvider";

/**
 * Looking around the room.
 *
 * The room is drawn at a fixed width — wide enough that a desk, a wall of
 * photographs and a window can all be themselves — and centred in the viewport.
 * On anything narrower than that, the sides fall off the screen, and this layer
 * is how you go and see them: the whole scene slides under a drag, within
 * exactly the amount that is hidden, so there is never an edge to fall off.
 *
 * On a screen wide enough to hold the room there is nothing hidden, so there is
 * nothing to drag, and this is an ordinary centred div.
 *
 * The pan is let go of entirely while the camera is working. Every measurement
 * the camera takes is a viewport coordinate read at the moment of the tap, so a
 * room that could still be slid sideways would pull itself out from under the
 * photograph in mid-air.
 */
export default function PanLayer({ children }: { children: ReactNode }) {
  const { active } = useCamera();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  // How far the room can travel each way: half of whatever doesn't fit.
  const [slack, setSlack] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const hidden = Math.max(0, (el.offsetWidth - window.innerWidth) / 2);
      setSlack(hidden);
      // A window that just grew can leave the room parked past its own edge.
      const current = x.get();
      const clamped = Math.min(hidden, Math.max(-hidden, current));
      if (clamped !== current) x.set(clamped);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [x]);

  const pannable = slack > 0 && !active;

  return (
    <motion.div
      ref={ref}
      drag={pannable ? "x" : false}
      dragConstraints={{ left: -slack, right: slack }}
      /* No give at the ends. The room is only just wider than the screen, so
         any overshoot at all shows the paper running out at the edge. */
      dragElastic={0}
      dragTransition={{ power: 0.2, timeConstant: 340 }}
      style={{
        x,
        width: "var(--room-w)",
        left: "50%",
        marginLeft: "calc(var(--room-w) / -2)",
        touchAction: pannable ? "none" : "auto",
      }}
      className={`absolute inset-y-0 ${pannable ? "cursor-grab active:cursor-grabbing" : ""}`}
    >
      {children}
    </motion.div>
  );
}

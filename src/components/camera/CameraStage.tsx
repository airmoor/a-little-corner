"use client";

import { motion, useTransform } from "framer-motion";
import type { ReactNode } from "react";
import { STAGE_SCALE, useCamera } from "./CameraProvider";

/**
 * CameraStage — the room, on a dolly.
 *
 * The whole scene lives in here. As the camera pushes in, this layer scales up
 * around whatever was touched, sliding the rest of the room outward and past
 * the viewer. The room is a paper collage — one flat plane of cut-outs — so it
 * moves as a single sheet, and the sense of depth comes from the atmosphere
 * laid over the top, which does not move at all.
 *
 * Transform only. An earlier version also animated `blur()` here to throw the
 * room out of focus; that re-rasterized a full-screen layer — one carrying SVG
 * `.torn` filters and blend modes — on every single frame, and was the main
 * cause of the stutter. The vignette carries that separation now.
 */
export default function CameraStage({ children }: { children: ReactNode }) {
  const { push, focus, active } = useCamera();

  const scale = useTransform(push, [0, 1], [1, STAGE_SCALE]);

  // Zoom toward the thing itself, not the middle of the screen. This layer is
  // pinned to the viewport at 0,0, so a viewport coordinate is already its own.
  const origin = focus ? `${focus.box.cx}px ${focus.box.cy}px` : "50% 50%";

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        scale,
        transformOrigin: origin,
        // Promote only while the shot is running: holding a screen-sized layer
        // on the GPU permanently costs memory for no benefit at rest.
        willChange: active ? "transform" : "auto",
      }}
    >
      {children}
    </motion.div>
  );
}

"use client";

import { useEffect, useState } from "react";

/**
 * True on a phone-width screen (≤ 640px).
 *
 * The room has two quite different lives. On anything desktop-ish it is one wide
 * landscape scene you look across; on a phone that never worked — a 16:9 wall
 * forced into a tall viewport cropped its own furniture off and left ten
 * photographs to be dragged past sideways. So below this width the scene switches
 * to a portrait plate and a vertical column of photographs instead (see
 * `Backdrop` and `RoomScene`).
 *
 * Starts `false` so the server and the first client paint agree (desktop), then
 * corrects on mount — a phone shows the wide layout for a frame before it flips,
 * which is invisible in practice and avoids a hydration mismatch.
 */
export function useIsPhone(): boolean {
  const [phone, setPhone] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const sync = () => setPhone(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return phone;
}

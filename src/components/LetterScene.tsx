"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { letter } from "@/content/letter";
import { CALM, useCamera } from "./camera/CameraProvider";
import StepBack from "./StepBack";

/**
 * What is in the envelope.
 *
 * The photographs are carried off the wall to be looked at; the envelope is not.
 * It stays exactly where it was left on the desk, and the camera simply walks up
 * to it — so the letter is not a thing that flies, it is a thing that unfolds,
 * once the room has finished arriving.
 *
 * That difference is deliberate. A photograph is an object you pick up. A letter
 * is something someone wrote to you, and it should appear the way a page does
 * when it is taken out of its envelope and opened flat.
 */
export default function LetterScene() {
  const { focus, phase, reduced, close } = useCamera();
  const closeRef = useRef<HTMLButtonElement>(null);

  const shown = focus?.target.kind === "letter";

  // Escape to leave; move focus into the letter once the room has dimmed.
  useEffect(() => {
    if (!shown) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const id = window.setTimeout(() => closeRef.current?.focus(), 260);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(id);
    };
  }, [shown, close]);

  if (!shown) return null;

  const open = phase === "page";

  return (
    <div
      className="stage-inset pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="A letter"
    >
      <motion.div
        initial={false}
        /* The fold coming out of it: the page tips up towards you and settles
           a degree off square, the way a sheet does when it is put down. */
        animate={
          open
            ? { opacity: 1, y: 0, rotateX: 0, rotate: -1 }
            : { opacity: 0, y: 22, rotateX: 18, rotate: -1 }
        }
        transition={{ duration: reduced ? 0.001 : 1.05, ease: CALM }}
        style={{ transformOrigin: "top center", perspective: 1400 }}
        className="pointer-events-auto relative flex max-h-full w-full max-w-xl flex-col"
      >
        <div className="paper torn absolute inset-0" />

        <div className="letter-scroll relative max-h-full overflow-y-auto overflow-x-hidden overscroll-contain px-9 py-10 [touch-action:pan-y] sm:max-h-[76svh]">
          <p className="font-type text-[0.68rem] uppercase tracking-[0.24em] text-ink-soft">
            {letter.eyebrow}
          </p>

          {letter.lines.map((line) => (
            <p
              key={line}
              className="mt-5 font-serif text-lg italic leading-relaxed text-ink text-balance"
            >
              {line}
            </p>
          ))}

          <span className="mt-7 block font-hand text-3xl text-terracotta">
            {letter.sign}
          </span>
        </div>

        <StepBack ref={closeRef} onClick={close} shown={open} reduced={reduced} />
      </motion.div>
    </div>
  );
}

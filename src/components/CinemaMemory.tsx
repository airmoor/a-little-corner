"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { animate, motion, useMotionValue } from "framer-motion";
import {
  CALM,
  PUSH_IN,
  PUSH_OUT,
  measureFocusable,
  useCamera,
  type Box,
} from "./camera/CameraProvider";
import PolaroidFace from "./PolaroidFace";
import StepBack from "./StepBack";

/**
 * CinemaMemory — the arrival.
 *
 * The chosen photograph is lifted off the wall and carried, unhurried, to the
 * viewer. It rotates to face them, grows to the hand, and only once it has
 * settled does its written memory unfold beside it.
 *
 * The photo's journey is a manual FLIP: we render it at its final size and
 * place, measure that, then start it back over its old spot on the wall and
 * ease the difference away — so the growth is crisp, never a blurry upscale.
 */
/**
 * The photo turns a little as it's carried, catching the light the way a card
 * held in a hand does. It leaves the wall square-on and arrives square-on, and
 * likewise on the way back: the turn belongs to the journey, so neither
 * hand-off has the card snapping through 9 degrees on the frame it changes
 * hands. A shade less of it coming back, like the rest of the return.
 */
const TURN_IN = [0, 9, 0];
const TURN_OUT = [0, 7, 0];
const TURN_AT = [0, 0.4, 1];

export default function CinemaMemory() {
  const { push, focus, phase, reduced, close } = useCamera();

  const closeRef = useRef<HTMLButtonElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  // The hero's transform, driven straight from the wall card to its resting place.
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const rotate = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const memory = focus?.target.kind === "memory" ? focus.target.memory : null;

  /**
   * The hero's *resting* geometry, independent of wherever it is mid-flight.
   *
   * `offsetWidth` is the layout width, immune to transforms — unlike a bounding
   * rect, which reports the inflated axis-aligned box of a rotated element.
   * Scale and rotation both act about the centre, so only the translation has
   * to be backed out to recover the resting centre.
   */
  const restingBox = useCallback((): Box | null => {
    const el = photoRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      cx: r.left + r.width / 2 - x.get(),
      cy: r.top + r.height / 2 - y.get(),
      width: el.offsetWidth,
      rotate: 0,
    };
  }, [x, y]);

  // Lift off: take the photo from wherever it is on the wall, put the one in
  // flight down on top of it, and ease it forward from there.
  useLayoutEffect(() => {
    if (phase !== "pushing" || !focus || !memory) return;
    const dest = restingBox();
    if (!dest) return;

    const from = focus.box;
    x.set(from.cx - dest.cx);
    y.set(from.cy - dest.cy);
    scale.set(from.width / dest.width);
    rotate.set(from.rotate);

    const t = { duration: reduced ? 0.001 : PUSH_IN, ease: CALM };
    animate(x, 0, t);
    animate(y, 0, t);
    animate(scale, 1, t);
    animate(rotate, -2, t);
    animate(rotateY, TURN_IN, { ...t, times: TURN_AT });
    // Arm once per opened memory.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memory?.id]);

  // Pull back: reverse the journey, returning the photo to its exact spot.
  // Re-measuring the slot (rather than trusting the open-time box) keeps this
  // honest if the window was resized while the memory was open — but the room
  // is still pushed in as we measure, so the camera's position goes along to
  // take that scale back out. Without it the photo lands at the *zoomed* size
  // of its slot and stays enlarged.
  useEffect(() => {
    if (phase !== "closing" || !focus || !memory) return;
    const dest = restingBox();
    if (!dest) return;

    const home =
      measureFocusable(memory.id, memory.rotate, { focus, push: push.get() }) ??
      focus.box;
    const t = {
      duration: reduced ? 0.001 : PUSH_OUT,
      ease: CALM,
      delay: reduced ? 0 : 0.12,
    };
    animate(x, home.cx - dest.cx, t);
    animate(y, home.cy - dest.cy, t);
    animate(scale, home.width / dest.width, t);
    animate(rotate, home.rotate, t);
    animate(rotateY, TURN_OUT, { ...t, times: TURN_AT });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Escape to leave; move focus into the scene once the room has dimmed.
  useEffect(() => {
    if (!memory) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const id = window.setTimeout(() => closeRef.current?.focus(), 260);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(id);
    };
  }, [memory, close]);

  if (!memory) return null;

  const noteShown = phase === "page";

  return (
    /*
     * The layer takes no pointer events of its own, so everything it does not
     * cover falls through to the vignette behind — which is the way out. Only
     * the photograph and its note take the pointer back.
     */
    <div
      className="stage-inset pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
      style={{ perspective: 1600 }}
      role="dialog"
      aria-modal="true"
      aria-label={`Memory: ${memory.caption}`}
    >
      {/* The memory, laid out as a scrapbook page. The photo is reserved its
          final slot from the first frame, so the note can unfold beside it
          without ever nudging the photo out of place.

          The two are stacked on a phone and set side by side from `sm` up, and
          in both cases the whole arrangement is capped at the screen: the photo
          takes the size it asks for and the note gives way around it, rather
          than the pair growing until the ends are cut off. */}
      <div className="relative flex max-h-full w-full max-w-3xl flex-col items-center justify-center gap-5 sm:flex-row sm:items-center sm:gap-9">
        {/* The photograph — carried in from the wall. */}
        <motion.div
          ref={photoRef}
          style={{ x, y, scale, rotate, rotateY, willChange: "transform" }}
          /* The same card, simply nearer: it is rendered at the size it arrives
             at and starts out scaled down onto its place on the wall, so the
             photograph grows into focus rather than being blown up.

             Height follows width — a card stands about 1.5x as tall as it is
             wide — so the height cap is what actually keeps it in the window.
             Stacked, the note needs room underneath, so the photo takes about
             half the screen; side by side it can have far more. `svh` rather
             than `vh`: it is the height that survives a mobile address bar
             sliding away, and it does not change under the animation the way
             `dvh` would. */
          className="pointer-events-auto relative z-10 shrink-0 [--card-w:min(19rem,60vw,32svh)] sm:[--card-w:min(19rem,42vw,46svh)]"
        >
          <PolaroidFace memory={memory} near />
        </motion.div>

        {/* Its written memory — unfolds once the photo has arrived. `min-h-0` is
            what lets it yield to the photo on a short screen instead of pushing
            the pair past the ends of the viewport; `min-w-0` does the same on
            the horizontal when the two sit side by side. */}
        <motion.div
          initial={false}
          animate={
            noteShown
              ? { opacity: 1, y: 0, rotateX: 0, rotate: 1 }
              : { opacity: 0, y: 16, rotateX: 14, rotate: 1 }
          }
          transition={{ duration: reduced ? 0.001 : 1, ease: CALM }}
          style={{ transformOrigin: "top center" }}
          className="pointer-events-auto relative flex min-h-0 w-full min-w-0 max-w-sm flex-col justify-center"
        >
          {/* Lifts the sheet off whatever is behind it — in the pushed-in room
              that is often the next photograph along. A plain box-shadow on
              its own layer, so the torn filter never has to draw it. */}
          <div
            aria-hidden
            className="absolute inset-2 rounded-sm"
            style={{ boxShadow: "0 22px 48px rgba(18,12,4,0.45), 0 4px 12px rgba(18,12,4,0.25)" }}
          />
          <div className="paper torn absolute inset-0" />
          {/* Long notes scroll here rather than pushing the layout past the
              viewport. Vertical only — `overflow-x-hidden` is explicit so the
              browser never promotes the x axis to `auto` on its own — and the
              scroll is kept to this sheet, so reaching its end doesn't hand the
              gesture to the room behind. */}
          <div className="relative max-h-full overflow-y-auto overflow-x-hidden overscroll-contain px-8 py-9 [touch-action:pan-y] sm:max-h-[70svh]">
            {/* When and where, if the memory knows. Not the caption again —
                that is written on the photograph right beside it. */}
            {memory.when && (
              <span className="mb-4 block font-type text-xs uppercase tracking-[0.18em] text-ink">
                {memory.when}
              </span>
            )}
            <p className="font-serif text-lg italic leading-relaxed text-ink text-balance">
              {memory.note}
            </p>
          </div>

          <StepBack
            ref={closeRef}
            onClick={close}
            shown={noteShown}
            reduced={reduced}
          />
        </motion.div>
      </div>
    </div>
  );
}

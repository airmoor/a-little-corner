"use client";

import type { CSSProperties, ReactNode } from "react";

/**
 * One cut-out pasted into the room.
 *
 * Everything in the scene is placed the same way — by percentage of the room,
 * never by flow — so the whole collage keeps its arrangement at any size and the
 * camera can measure anything in it the same way.
 *
 * **A prop is scenery.** It used to be able to be a third thing: something you
 * could find, which lifted under the pointer and said a small handwritten line
 * back. A dozen of those is what made the room read as an illustration covered
 * in buttons — attention went everywhere, and so nothing in the frame was the
 * subject. There is now exactly one prop in the room that answers at all, and it
 * is the letter on the desk; everything else is furniture, and furniture stays
 * out of the way.
 *
 * So a prop with no `onActivate` is a plain `aria-hidden` div: no focus, no
 * hover, nothing to discover. Give it a `label` and an `onActivate` and it
 * becomes the thing the room is about.
 */

interface PropProps {
  children: ReactNode;
  /** Placement and size, in percentages of the room. */
  style: CSSProperties;
  className?: string;
  /** Read out in place of the drawing. Required for anything that opens. */
  label?: string;
  /** Marks this prop as something the camera can be sent to. */
  focusId?: string;
  onActivate?: () => void;
  /** A hair of ambient life — hung things swing, rooted things lean. */
  sway?: "hang" | "root";
}

export default function Prop({
  children,
  style,
  className = "",
  label,
  focusId,
  onActivate,
  sway,
}: PropProps) {
  const swayClass = sway === "hang" ? "sway-hang" : sway === "root" ? "sway-root" : "";
  const art = <span className={`prop-art block ${swayClass}`}>{children}</span>;

  if (!onActivate) {
    return (
      <div aria-hidden style={style} className={`absolute ${className}`}>
        {art}
      </div>
    );
  }

  return (
    <button
      type="button"
      data-focus={focusId}
      aria-label={label}
      onClick={onActivate}
      style={style}
      className={`prop absolute cursor-pointer touch-manipulation outline-none focus-visible:ring-2 focus-visible:ring-terracotta/70 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent ${className}`}
    >
      {art}
    </button>
  );
}

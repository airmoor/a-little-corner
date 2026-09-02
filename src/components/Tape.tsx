import type { TapeStyle } from "@/lib/types";

/**
 * One or two strips of washi tape, placed to match a memory's tape style.
 *
 * Tape straddles the top edge of the photo it holds: half of it on the wall,
 * half lying across the paper. It is drawn *over* the card — that is the whole
 * point of tape, and drawing it underneath read as the photograph covering the
 * thing supposedly holding it up. The `2.4em` strip sits `1.2em` above the
 * card's edge, which is exactly the paper's own margin, so the half that lands
 * on the card lies on the white border and never covers the picture.
 *
 * Rendered by the wall card, never by the card in flight — see `PolaroidFace`'s
 * `tape` slot.
 *
 * Sized in `em`, like everything else on a card, so a strip is always the same
 * fraction of the photo it holds. On the wall these work out to the pixel sizes
 * they always had.
 */
export default function Tape({ style }: { style: TapeStyle }) {
  const strip = "tape-strip absolute";
  const base = { height: "2.4em", top: "-1.2em" } as const;

  switch (style) {
    case "corner-tl":
      return (
        <span
          aria-hidden
          className={`${strip} -rotate-45`}
          style={{ ...base, width: "6.4em", left: "-1.2em" }}
        />
      );
    case "corner-tr":
      return (
        <span
          aria-hidden
          className={`${strip} rotate-45`}
          style={{ ...base, width: "6.4em", right: "-1.2em" }}
        />
      );
    case "double":
      return (
        <>
          <span
            aria-hidden
            className={`${strip} -rotate-[38deg]`}
            style={{ ...base, width: "5.6em", left: "-0.8em" }}
          />
          <span
            aria-hidden
            className={`${strip} rotate-[38deg]`}
            style={{ ...base, width: "5.6em", right: "-0.8em" }}
          />
        </>
      );
    case "top":
    default:
      return (
        <span
          aria-hidden
          className={`${strip} left-1/2 -translate-x-1/2 -rotate-2`}
          style={{ ...base, width: "9.6em" }}
        />
      );
  }
}

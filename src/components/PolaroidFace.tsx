import type { ReactNode } from "react";
import type { Memory } from "@/lib/types";
import MemoryScene from "./paper/MemoryScene";

/**
 * The paper face of a photograph — the same physical object whether it is
 * pinned to the wall or held up close.
 *
 * Every measurement inside is written in `em`, against a font-size derived from
 * the card's own width (1em = width / 16). A small card and a large one are
 * therefore exact scale copies of one another: same aspect ratio, same paper
 * margin, same caption, same torn corners, all in proportion. That is what lets
 * the camera carry one into the other with a single uniform transform — nothing
 * inside shifts, re-wraps or changes shape on the way, so the hand-off between
 * the wall card and the one in flight is invisible.
 *
 * Callers set the width through the `--card-w` custom property, so it can still
 * carry clamps and breakpoints; everything else follows from it.
 */

interface PolaroidFaceProps {
  memory: Memory;
  /**
   * True for the card drawn out to the viewer. A bigger sheet tears at a bigger
   * grain: the deckle and its shadow are stepped up by roughly the same factor
   * the card is stepped up by, so that when the near card is scaled down onto
   * the wall card's footprint the two edges read as the same torn paper.
   */
  near?: boolean;
  /**
   * What is holding this card to the wall, drawn on top of the paper.
   *
   * A slot rather than something the face draws for itself: tape belongs to the
   * wall, not to the photograph. The card in flight passes nothing, so it
   * arrives clean; the card on the wall passes a strip that can fade on its own
   * clock while the photo is away. It renders inside the face's `em` space, so
   * a strip is still sized against the card that it holds.
   */
  tape?: ReactNode;
  /**
   * Hide the photograph but keep its place — for the wall card whose twin is
   * currently held up to the viewer. The tape above it stays visible, and the
   * slot stays exactly the size the camera measured, so the photo has an exact
   * spot to come home to.
   */
  photoHidden?: boolean;
}

export default function PolaroidFace({
  memory,
  near = false,
  tape,
  photoHidden = false,
}: PolaroidFaceProps) {
  return (
    <div
      className="relative"
      style={{ width: "var(--card-w)", fontSize: "calc(var(--card-w) / 16)" }}
    >
      {/* The photograph itself. `visibility` rather than unmounting: it keeps
          its footprint, which is the thing the flight is measured against. */}
      <div style={{ visibility: photoHidden ? "hidden" : "visible" }}>
        {/* Torn paper backing (carries the matte shadow); content stays crisp. */}
        <div
          className={`paper ${near ? "torn-lg" : "torn"} absolute inset-0`}
          style={{ borderRadius: "0.2em" }}
        />

        <div className="relative" style={{ padding: "1.2em", paddingBottom: "3.2em" }}>
          <div
            className={`${near ? "torn" : "torn-sm"} relative aspect-[4/5] overflow-hidden`}
            style={{ backgroundColor: memory.tint }}
          >
            {memory.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={memory.image}
                alt={memory.caption}
                className="h-full w-full object-cover"
              />
            ) : (
              <MemoryScene scene={memory.scene} tint={memory.tint} />
            )}
          </div>

          {/* `0.5em` of the caption's own size — half of 2em — so the gap above it
              scales with the card like everything else. */}
          <p
            className="text-center font-hand leading-none text-ink"
            style={{ fontSize: "2em", marginTop: "0.5em" }}
          >
            {memory.caption}
          </p>
        </div>
      </div>

      {/* Last, so it lies over the paper it is holding down. */}
      {tape}
    </div>
  );
}

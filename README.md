# A Little Corner

A small interactive room with a wall of Polaroids. Pick a photo off the wall and
the camera carries it to you with its note; open the envelope on the desk and a
letter unfolds. Built to feel like a physical corner of a room, not a photo
gallery.

> This is the public version of a personal project — a gift made for one person.
> The original photographs and letter were replaced with hand-painted stand-ins;
> everything else is the same code.

## Stack

- **Next.js 15** (App Router), **React 19**, **TypeScript**
- **Framer Motion** for the camera, the card flight and the letter
- **Tailwind CSS** plus a small set of paper / tape / ink tokens in `globals.css`
- SVG filters (`feTurbulence` + `feDisplacementMap`) for torn paper edges and the gouache texture

## How it is built

**One camera, not a set of modals.** Opening a photo is a camera move:
`CameraProvider` measures the card on the wall and flies a twin of it to the
viewer with a single uniform transform, while the room dims and drifts behind.
Closing reverses the same path, so the card lands back in its exact slot.

**Cards that scale as one object.** Every measurement inside a Polaroid is in
`em` against a font-size derived from the card's width (`1em = width / 16`). A
wall card and a near card are exact scale copies — same margins, caption and torn
edges — so the hand-off between them is invisible.

**A board, not a layout.** The ten cards are positioned in percentages of a
fixed 1.6:1 board that scales as one unit, so the composition is a drawing that
holds at every window size. On a phone the room keeps its size and becomes
draggable (`PanLayer`) instead of shrinking the cards to 57px.

**One bitmap for the room.** The room started as forty SVG cut-outs with live
paper filters. It is now a single painted plate, with only the things that open
(the photos and the envelope) drawn live on top — the camera moves one composited
bitmap instead of re-rasterising filters every frame.

**Motion and access.** Focus moves into an opened memory or letter, `Escape`
closes, dialogs are labelled, and `prefers-reduced-motion` turns the camera moves
into near-instant cuts.

## Running it

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Making it yours

Everything on the wall comes from two files:

- [`src/data/memories.ts`](src/data/memories.ts) — each memory's `caption`, `note`,
  resting `rotate`, `tape` style and `x` / `y` position on the board.
- [`src/data/room.ts`](src/data/room.ts) — the letter in the envelope.

To use real photographs, drop them into `public/memories/` and set a memory's
`image`, e.g. `image: "/memories/lisbon.jpg"`. A portrait crop near 4:5 fits the
frame best. Without an image, the frame shows a painted scene (`scene`) in the
memory's `tint`.

## Structure

```
src/
  app/                  layout, page, global paper and wall styles
  components/
    Room                composes the room, camera and overlays
    camera/             camera state, stage transform, vignette
    room/               backdrop plate, props, drag-to-pan, hint
    PolaroidCard        a card on the wall
    PolaroidFace        the paper face shared by wall and near card
    CinemaMemory        a memory held up to the viewer, with its note
    LetterScene         the letter from the envelope
    paper/              SVG paper filters and painted placeholder scenes
  data/                 memories and the letter
  lib/                  types and hooks
```

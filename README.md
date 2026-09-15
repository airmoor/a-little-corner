# A Little Corner

A small interactive room with a wall of Polaroids. Pick a photo off the wall and
the camera carries it to you with its note; open the envelope on the desk and a
letter unfolds. Built to feel like a physical corner of a room, not a photo
gallery.

> This is the public version of a personal project — a gift made for one person.
> The original photographs and letter were replaced with hand-painted stand-ins;
> the room, the camera and the paper are the original code.

## Make your own

You can turn this into a wall of your own — for a trip, a year, or as a gift —
by editing two files and dropping in your photos. No code changes needed.

1. **Fork or clone** this repository.
2. **Add your photos** to [`public/memories/`](public/memories). Up to ten,
   portrait (about 4:5), around 1100px wide.
3. **Write the memories** in [`src/content/memories.ts`](src/content/memories.ts) —
   one entry per photo, in order along the wall:

   ```ts
   {
     caption: "the last swim",               // handwritten under the photo
     when: "september · the cove",            // small line above the note (optional)
     note: "The water was colder than it looked, and I went in anyway.",
     image: "/memories/cove.jpg",             // your photo; leave out to keep the painting
   },
   ```

4. **Write the letter** in [`src/content/letter.ts`](src/content/letter.ts) —
   the line at the top, one string per paragraph, and a signature.
5. **Run it** with `npm install && npm run dev`, then deploy — for example, import
   the repository into [Vercel](https://vercel.com/new); it needs no settings.

The positions, tilt and tape for ten cards are already composed, so the wall
stays balanced whatever you put on it. Fewer than ten works too — the remaining
slots stay empty.

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
  content/              ✏️ the words and photos — memories and the letter
  data/                 the arrangement of the ten cards on the wall
  lib/                  types and hooks
```

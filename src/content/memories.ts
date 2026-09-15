import type { MemoryContent } from "@/lib/types";

/**
 * ✏️  THE PHOTOS ON THE WALL — edit this file to make the wall yours.
 *
 * Up to ten memories, in order along the wall (left to right, alternating high
 * and low). Each one has:
 *
 *   caption  handwritten under the photo — keep it short, 1–4 words
 *   when     optional, small line above the note: a date, a place, a time
 *   note     what shows beside the photo when it is opened — a sentence or two
 *   image    optional, a photo in /public/memories, e.g. "/memories/lake.jpg"
 *            (portrait, roughly 4:5, ~1100px wide is plenty)
 *   scene    shown when there is no image: a painted stand-in —
 *            "path" | "window" | "lake" | "rain" | "cup" | "mountains" |
 *            "field" | "sea" | "night" | "hills"
 *   tint     optional colour behind the scene / photo while it loads
 *
 * Positions and tilt are already worked out for ten cards in
 * `src/data/memories.ts` — you don't need to touch them.
 */
export const memories: MemoryContent[] = [
  {
    caption: "first light",
    when: "may · the coast road",
    note: "Out of the door before the town woke up. No plan beyond the next bend in the road.",
    scene: "path",
  },
  {
    caption: "rainy sunday",
    when: "a sunday in march",
    note: "Tea going cold on the sill, rain on the glass, nowhere to be. The best kind of slow.",
    scene: "window",
  },
  {
    caption: "still water",
    when: "august · the far shore",
    note: "I was aiming for the far shore and never made it. This is the view from where I gave up — not a bad place to give up.",
    scene: "lake",
  },
  {
    caption: "caught in the rain",
    when: "april · the ridge path",
    note: "Forty minutes from shelter when the sky opened. Soaked through, and laughing the whole way back.",
    scene: "rain",
  },
  {
    caption: "second coffee",
    when: "a tuesday, mid-morning",
    note: "A corner table, a second coffee, a page of notes that went nowhere. Some mornings are just for sitting.",
    scene: "cup",
  },
  {
    caption: "above the clouds",
    when: "july · 5:40 a.m.",
    note: "Up at five and completely worth it. The valley was full of cloud, and the peaks floated on top of it.",
    scene: "mountains",
  },
  {
    caption: "wildflowers",
    when: "june · somewhere inland",
    note: "A verge of wildflowers by a bus stop in the middle of nowhere. The bus was late; nobody minded.",
    scene: "field",
  },
  {
    caption: "the last swim",
    when: "september · the cove",
    note: "The water was colder than it looked, and I went in anyway. The last swim of the summer, and the best one.",
    scene: "sea",
  },
  {
    caption: "the town at night",
    when: "october · the old town",
    note: "Lit windows all the way up the hill, every one of them somebody else's evening.",
    scene: "night",
  },
  {
    caption: "the long way home",
    when: "the last day",
    note: "Took the slow road back on purpose. Some days you don't want to arrive.",
    scene: "hills",
  },
];

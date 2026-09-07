/**
 * The room, as one painted plate.
 *
 * Everything that used to be built out of SVG cut-outs and live paper filters —
 * the wall, the floor, the window, the shelf, the clock, the desk and the props
 * on it — is now a single flat image. That is the whole performance story of the
 * scene: the camera and the pan move *one bitmap* instead of forty filtered
 * nodes, and a bitmap composites on the GPU for free where a `feTurbulence`
 * re-rasterizes on the CPU every frame it is scaled or dragged.
 *
 * The only things still drawn as live elements on top of this are the two that
 * actually open — the photographs and the letter.
 *
 * `object-cover` + `object-bottom`: the plate keeps the desk pinned to the
 * bottom of the frame and lets any overflow crop off the top, so the tabletop
 * (and the letter that sits on it) never drifts up the screen as the viewport
 * changes shape.
 */
export default function Backdrop() {
  return (
    <div
      aria-hidden
      className="plane pointer-events-none absolute inset-0"
      style={{ zIndex: 0 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/room.png"
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-cover object-bottom"
      />
    </div>
  );
}

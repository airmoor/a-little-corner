/**
 * PaperDefs
 *
 * A single hidden SVG holding the filters that give everything its handmade,
 * paper-collage feel. Rendered once near the root so any element can reach a
 * filter through CSS `filter: url(#id)`.
 *
 * - torn / torn-sm / torn-lg  → hand-torn, deckled paper edges (displacement)
 * - gouache                   → soft, slightly bleeding painted edges
 * - crayon                    → a wobbling edge for tape and small cut-outs
 */
export default function PaperDefs() {
  return (
    <svg
      aria-hidden
      focusable="false"
      width="0"
      height="0"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs>
        {/*
          Every scale below was halved from its first pass. At the old values a
          "deckled edge" was, at the sizes these actually render on screen, just
          a ragged one — displacement is a pixel amplitude, and it does not scale
          down with the object wearing it. A photograph corner at 90px on a phone
          wall got the same 7-unit wobble as a full-width torn strip, and on the
          smaller shape that reads as damage, not paper. Kept low and let the
          gentle, low-frequency turbulence (unchanged) do the work of feeling
          hand-cut, rather than the amplitude.
        */}
        <filter id="torn" x="-6%" y="-6%" width="112%" height="112%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.014 0.018"
            numOctaves="2"
            seed="7"
            result="n"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="3.2"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        <filter id="torn-sm" x="-8%" y="-8%" width="116%" height="116%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.03 0.035"
            numOctaves="2"
            seed="12"
            result="n"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="1.8"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        <filter id="torn-lg" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.011"
            numOctaves="2"
            seed="3"
            result="n"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="5.5"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/*
          The painted stand-ins. Low-frequency turbulence bends every edge the
          way a loaded brush does, the blur lets it bleed, and a touch of
          desaturation pulls the shapes back to the muted pigments of the room
          they hang in — without it they read as flat vector icons on a
          watercolour wall. It is applied in viewBox units (200 x 250), so the
          wobble scales with the card rather than staying a fixed pixel size.
        */}
        <filter id="gouache" x="-12%" y="-12%" width="124%" height="124%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.013 0.016"
            numOctaves="3"
            seed="9"
            result="n"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="5"
            xChannelSelector="R"
            yChannelSelector="G"
            result="d"
          />
          <feGaussianBlur in="d" stdDeviation="0.7" result="b" />
          <feColorMatrix in="b" type="saturate" values="0.82" />
        </filter>

        <filter id="crayon" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05 0.06"
            numOctaves="2"
            seed="21"
            result="n"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="1.6"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}

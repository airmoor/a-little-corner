import type { SceneKind } from "@/lib/types";

/**
 * MemoryScene
 *
 * A tiny hand-painted gouache picture that fills a memory's frame in place of
 * a photograph. Everything is built from a few soft, wobbling paper shapes in
 * the memory's own colour — no gradients, no gloss — so each frame reads as a
 * little painting rather than a swatch.
 */

const IVORY = "#F4ECD6";
const CREAM = "#E9DCBC";

// Semi-transparent washes let one tint carry a whole scene: white lifts it,
// dark deepens it, so hills / sea / rooftops stay in the same colour family.
const lift = (o: number) => `rgba(255,252,242,${o})`;
const deep = (o: number) => `rgba(42,32,20,${o})`;

function Scene({ scene, tint }: { scene: SceneKind; tint: string }) {
  switch (scene) {
    case "night":
      return (
        <>
          <rect width="200" height="250" fill={tint} />
          <rect width="200" height="250" fill={deep(0.4)} />
          <circle cx="52" cy="52" r="21" fill={IVORY} />
          <circle cx="44" cy="46" r="21" fill={tint} opacity="0.55" />
          <circle cx="120" cy="40" r="2.4" fill={IVORY} />
          <circle cx="150" cy="66" r="1.8" fill={IVORY} />
          <circle cx="96" cy="80" r="1.6" fill={IVORY} />
          <circle cx="168" cy="30" r="2" fill={IVORY} />
          <path
            d="M0 250 L0 196 Q20 190 40 195 L40 250 Z"
            fill={deep(0.5)}
          />
          <path
            d="M52 250 L54 176 Q78 170 96 178 L98 250 Z"
            fill={deep(0.62)}
          />
          <path
            d="M110 250 L112 200 Q140 194 158 202 L160 250 Z"
            fill={deep(0.5)}
          />
          <path d="M168 250 L170 184 L200 190 L200 250 Z" fill={deep(0.6)} />
          <rect x="64" y="196" width="7" height="9" fill={tint} opacity="0.9" />
          <rect x="80" y="200" width="7" height="9" fill={tint} opacity="0.9" />
          <rect x="124" y="216" width="6" height="8" fill={tint} opacity="0.9" />
        </>
      );
    case "sea":
      return (
        <>
          <rect width="200" height="250" fill={tint} />
          <rect width="200" height="140" fill={lift(0.34)} />
          <circle cx="146" cy="58" r="24" fill={IVORY} opacity="0.92" />
          <path d="M0 140 Q100 128 200 140 L200 250 L0 250 Z" fill={deep(0.2)} />
          <path
            d="M18 176 Q40 170 62 176"
            stroke={lift(0.5)}
            strokeWidth="3.2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M96 192 Q120 186 146 192"
            stroke={lift(0.45)}
            strokeWidth="3.2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M44 214 Q70 208 96 214"
            stroke={lift(0.4)}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        </>
      );
    case "path":
      return (
        <>
          <rect width="200" height="250" fill={tint} />
          <rect width="200" height="104" fill={CREAM} />
          <circle cx="150" cy="48" r="20" fill={IVORY} />
          <path d="M0 104 Q46 84 96 96 Q150 108 200 92 L200 130 L0 130 Z" fill={deep(0.14)} />
          <path
            d="M84 250 Q92 170 112 118 Q120 100 132 96 Q118 104 116 120 Q104 180 118 250 Z"
            fill={CREAM}
          />
          <path
            d="M84 250 Q92 170 112 118"
            stroke={deep(0.12)}
            strokeWidth="2"
            fill="none"
          />
        </>
      );
    case "field":
      return (
        <>
          <rect width="200" height="250" fill={tint} />
          <rect width="200" height="120" fill={lift(0.3)} />
          <path d="M0 120 Q100 108 200 120 L200 250 L0 250 Z" fill={deep(0.12)} />
          {[
            [44, 150],
            [88, 132],
            [128, 158],
            [166, 140],
          ].map(([x, y], i) => (
            <g key={i}>
              <path
                d={`M${x} 250 Q${x - 4} ${y + 30} ${x} ${y + 8}`}
                stroke={deep(0.22)}
                strokeWidth="2.4"
                fill="none"
                strokeLinecap="round"
              />
              <circle cx={x} cy={y} r="7.5" fill={IVORY} />
              <circle cx={x} cy={y} r="3" fill={tint} />
            </g>
          ))}
        </>
      );
    case "window":
      return (
        <>
          <rect width="200" height="250" fill={tint} />
          <rect width="200" height="250" fill={deep(0.08)} />
          <rect
            x="46"
            y="42"
            width="108"
            height="132"
            rx="4"
            fill={IVORY}
          />
          <rect x="56" y="52" width="88" height="112" fill={lift(0.6)} />
          <rect x="56" y="52" width="88" height="112" fill="#B9C7CB" opacity="0.5" />
          <rect x="96" y="52" width="4" height="112" fill={IVORY} />
          <rect x="56" y="104" width="88" height="4" fill={IVORY} />
          <rect x="40" y="172" width="120" height="9" rx="3" fill={CREAM} />
          <path
            d="M118 172 Q116 150 128 140 Q126 156 134 172 Z"
            fill={deep(0.3)}
          />
          <rect x="120" y="168" width="16" height="10" rx="2" fill={deep(0.35)} />
        </>
      );
    case "hills":
    default:
      return (
        <>
          <rect width="200" height="250" fill={tint} />
          <rect width="200" height="130" fill={lift(0.26)} />
          <circle cx="146" cy="66" r="27" fill={IVORY} />
          <path
            d="M0 250 L0 168 Q54 140 108 160 Q150 175 200 156 L200 250 Z"
            fill={deep(0.16)}
          />
          <path
            d="M0 250 L0 206 Q60 184 120 202 Q160 214 200 200 L200 250 Z"
            fill={deep(0.28)}
          />
        </>
      );
  }
}

export default function MemoryScene({
  scene = "hills",
  tint,
}: {
  scene?: SceneKind;
  tint: string;
}) {
  return (
    <svg
      viewBox="0 0 200 250"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden
    >
      <g filter="url(#gouache)">
        <Scene scene={scene} tint={tint} />
      </g>
    </svg>
  );
}

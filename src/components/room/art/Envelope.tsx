/**
 * The envelope on the desk — the one thing in the room that opens.
 *
 * Drawn already half-opened, with the flap thrown back and a corner of the card
 * showing: a shut envelope reads as decoration, and this one has to look like
 * something that is waiting for you.
 *
 * It is drawn *lying down*. The visitor is standing over the desk and looking at
 * its surface from above, so a letter on it is foreshortened — nearly twice as
 * wide as it is deep, its far edge shorter than its near one, and the flap
 * falling away from the viewer rather than up the picture. Drawn square to the
 * camera, as it used to be, it stood up off the tabletop like a card in a slot
 * and was the one object in the room facing a different direction from the room.
 *
 * It is also the lightest paper in the frame, on purpose. It has to be: it is the
 * only thing here anyone is asked to do something with.
 */
export default function Envelope({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 190 104"
      className={className}
      role="presentation"
      style={{ overflow: "visible", filter: "drop-shadow(2px 4px 3px rgba(59,51,39,0.24))" }}
    >
      {/* The body, wide and shallow: the shape a rectangle makes on a table you
          are standing over. Its near edge is the longer of the two. It is drawn
          first, so the flap and the card both rise cleanly out of its mouth. */}
      <path d="M14 40 L176 30 L186 92 L8 100 Z" fill="#EFDFBE" filter="url(#torn)" />

      {/* Its two folded-in sides, drawn as the creases they are. The meeting point
          sits below the middle, which is what tips the whole shape toward the
          viewer. All three are held a few units inside the body's corners, so the
          torn edge can eat the paper without leaving a line poking out past it. */}
      <path d="M22 44 L96 74 L170 34" fill="none" stroke="#D8C39A" strokeWidth="2.4" />
      <path d="M20 44 L96 74 L16 95 Z" fill="#E7D5B0" opacity="0.5" />
      <path d="M170 34 L96 74 L176 88 Z" fill="#E7D5B0" opacity="0.36" />

      {/* The flap, thrown back and hinged on the mouth — its base sits exactly on
          the body's back edge, so it reads as part of the envelope rather than a
          loose triangle floating above a card. */}
      <path d="M16 42 L174 32 L96 3 Z" fill="#E2CFA6" filter="url(#torn-sm)" />

      {/* The card standing up out of the mouth, in front of the flap — a little
          proud, and the lightest paper in the frame, because it is the one thing
          anyone is asked to open. */}
      <path d="M54 41 L142 34 L146 9 L58 16 Z" fill="#FEFBF3" filter="url(#torn-sm)" />
      <path d="M68 21 L132 17" stroke="#C8B48A" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M68 28 L122 24" stroke="#D6C49D" strokeWidth="2.4" strokeLinecap="round" />

      {/* A little wax heart, broken open once already. */}
      <ellipse cx="95" cy="74" rx="13" ry="10" fill="#C67B54" filter="url(#crayon)" />
      <path
        d="M95 79 Q86 74 88 70 Q91 67.5 95 71.5 Q99 67.5 102 70 Q104 74 95 79 Z"
        fill="#F6EFDC"
        opacity="0.88"
      />
    </svg>
  );
}

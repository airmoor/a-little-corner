"use client";

import Atmosphere from "./Atmosphere";
import CinemaMemory from "./CinemaMemory";
import LetterScene from "./LetterScene";
import { CameraProvider } from "./camera/CameraProvider";
import CameraStage from "./camera/CameraStage";
import Vignette from "./camera/Vignette";
import PanLayer from "./room/PanLayer";
import RoomHint from "./room/RoomHint";
import RoomScene from "./room/RoomScene";

/**
 * A little room of memories.
 *
 * One fixed scene, the height of the screen and no taller. There is no page to
 * scroll and no sections to move between: you have walked into a room and
 * stopped at the desk, and there is a letter on it.
 *
 * The layers, back to front:
 *
 *   the room      — four staged flats of collage, on the camera's dolly
 *   the grade     — how the room is lit: the corners dark, the desk open
 *   the hint      — a line that steps out of the way as soon as it is answered
 *   the vignette  — the light narrowing when something is opened, and the way out
 *   the arrival   — a photograph held up, or a letter unfolded
 *   the air       — grain and dust on the glass, which never move at all
 *
 * The grade and the vignette are the same idea at two strengths, and they hand
 * over: the grade lights the room at rest and is gone by a third of the way into
 * a shot, which is where the vignette has taken hold.
 *
 * `.scene` carries the room's measurements (see globals.css): how wide the room
 * is drawn, where the wall stops and the floor starts, and how big a photograph
 * hangs on it. Everything inside is placed against those.
 */
export default function Room() {
  return (
    <CameraProvider>
      <div className="scene fixed left-0 top-0 w-full overflow-hidden">
        <CameraStage>
          <PanLayer>
            <RoomScene />
          </PanLayer>
        </CameraStage>
      </div>

      <RoomHint />
      <Vignette />
      <CinemaMemory />
      <LetterScene />
      <Atmosphere />
    </CameraProvider>
  );
}

import { Shape } from "../base/shape";
import { PlayerOptions } from "./player-options";

export interface SceneOptions {
  renderer?: {
    shape?: Shape;
  };
  player?: PlayerOptions;
}

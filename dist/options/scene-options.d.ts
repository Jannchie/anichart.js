import { Shape } from "../base/Shape";
import { PlayerOptions } from "./player-options";
export interface SceneOptions {
    renderer?: {
        shape?: Shape;
    };
    player?: PlayerOptions;
}

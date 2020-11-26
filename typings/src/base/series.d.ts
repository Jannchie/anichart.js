import { Scene } from ".";
import { SceneOptions } from "../options/scene-options";
import { BaseScene } from "./base-scene";
export declare class Series extends BaseScene {
    private scenes;
    constructor(options?: SceneOptions);
    setCanvas(selector?: string): void;
    private init;
    play(): void;
    addScene(s: Scene): void;
    update(): void;
}
//# sourceMappingURL=series.d.ts.map
import { Scene } from "./Scene";
import { SceneOptions } from "../options/SceneOptions";
import { BaseScene } from "./BaseScene";
export declare class Series extends BaseScene {
    private scenes;
    constructor(options?: SceneOptions);
    setCanvas(selector?: string): void;
    play(): void;
    addScene(s: Scene): void;
    update(): void;
}

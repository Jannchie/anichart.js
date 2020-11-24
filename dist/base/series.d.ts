import { BaseScene, Scene, SceneOptions } from "./scene";
export declare class Series extends BaseScene {
    private scenes;
    constructor(options?: SceneOptions);
    setCanvas(selector?: string): void;
    private init;
    play(): void;
    addScene(s: Scene): void;
    update(): void;
}

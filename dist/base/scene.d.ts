import { Hintable, Hinter } from "./hint";
import { Component } from "../components";
import { DefaultComponentManager, Playable, Player, Renderer, Shape } from "./base";
export interface PlayerOptions {
    sec?: number;
    fps?: number;
}
export interface SceneOptions {
    renderer?: {
        shape?: Shape;
    };
    player?: PlayerOptions;
}
export declare class DefaultSceneOptions {
    renderer: {
        shape: {
            height: 1366;
            weight: 768;
        };
    };
    player: {
        fps: 60;
        sec: 5;
    };
}
export declare abstract class BaseScene implements Playable, Hintable {
    renderer: Renderer;
    componentManager: DefaultComponentManager;
    hinter: Hinter;
    player: Player;
    output: boolean;
    setCanvas(selector?: string): void;
    update(): void;
}
export declare class Scene extends BaseScene {
    constructor(options?: SceneOptions);
    private init;
    addComponent(c: Component): void;
}

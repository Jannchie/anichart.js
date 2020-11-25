import { Component } from "../components";
import { SceneOptions } from "../options/scene-options";
import { BaseScene } from "./base-scene";
export declare class Scene extends BaseScene {
    constructor(options?: SceneOptions);
    private init;
    addComponent(c: Component): void;
}

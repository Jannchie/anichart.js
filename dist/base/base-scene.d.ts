import { DefaultComponentManager } from "../default/default-component-manager";
import { Hintable, Hinter } from "./hint";
import { Playable } from "./playable";
import { Player } from "./player";
import { Renderer } from "./renderer";
export declare abstract class BaseScene implements Playable, Hintable {
    renderer: Renderer;
    componentManager: DefaultComponentManager;
    hinter: Hinter;
    player: Player;
    output: boolean;
    setCanvas(selector?: string): void;
    update(): void;
}

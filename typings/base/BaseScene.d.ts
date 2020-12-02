import { SceneOptions } from "../options/SceneOptions";
import { DefaultComponentManager } from "../default/DefaultComponentManager";
import { Hintable } from "../interface/hintable";
import { Hinter } from "../interface/Hinter";
import { Playable } from "../interface/playable";
import { Player } from "../interface/player";
import { Renderer } from "../interface/Renderer";
export declare abstract class BaseScene implements Playable, Hintable {
    renderer: Renderer;
    componentManager: DefaultComponentManager;
    hinter: Hinter;
    player: Player;
    output: boolean;
    setCanvas(selector?: string): void;
    constructor(o: SceneOptions);
    init(): void;
    setOptions(o: SceneOptions): void;
    update(): void;
}

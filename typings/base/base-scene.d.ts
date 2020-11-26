import { DefaultComponentManager } from "../default/default-component-manager";
import { Hintable } from "../interface/hintable";
import { Hinter } from "../interface/hinter";
import { Playable } from "../interface/playable";
import { Player } from "../interface/player";
import { Renderer } from "../interface/renderer";
export declare abstract class BaseScene implements Playable, Hintable {
    renderer: Renderer;
    componentManager: DefaultComponentManager;
    hinter: Hinter;
    player: Player;
    output: boolean;
    setCanvas(selector?: string): void;
    update(): void;
}
//# sourceMappingURL=base-scene.d.ts.map
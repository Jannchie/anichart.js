import { ColorPicker } from "./color";
import { Groupable } from "./../components/group";
declare type Shape = {
    width: number;
    height: number;
};
export interface Render extends Groupable, ColorPicker {
    shape: Shape;
}
export interface Renderable {
    render: Render;
    draw(): void;
}
export declare class DefaultRender implements Renderable {
    render: Render;
    draw(): void;
}
export interface Player {
    fps: number;
    sec: number;
    cFrame: number;
    totalFrames: number;
}
export interface Playable extends Renderable {
    player: Player;
    play(): void;
}
export declare class Scene implements Playable {
    player: Player;
    play(): void;
    render: Render;
    draw(): void;
}
export declare class Series extends Scene {
}
export {};

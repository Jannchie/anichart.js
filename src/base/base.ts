import { Background } from "./../components/background";
import { DefaultHinter, Hintable } from "./hint";
import { Component } from "../components";
import { EnhancedCanvasRenderingContext2D } from "../utils/enhance-ctx";
import { Colorable } from "./color";
import { Scene } from "./scene";
export type Shape = { width: number; height: number };
export interface ComponentManager {
  components: Component[];
  addComponent(c: Component): void;
}
export class DefaultComponentManager implements ComponentManager {
  components: Component[] = [new Background()];
  addComponent(c: Component): void {
    this.components.push(c);
  }
}
export interface Combinable {
  componentManager: ComponentManager;
}

export interface Renderer extends Colorable, Combinable, Hintable {
  shape: Shape;
  canvas: HTMLCanvasElement;
  ctx: EnhancedCanvasRenderingContext2D;
  draw(): void;
  setCanvas(selector?: string): EnhancedCanvasRenderingContext2D;
}

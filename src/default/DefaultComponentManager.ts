import { Scene } from "../base";
import { BaseScene } from "../base/BaseScene";
import { Component } from "../components";
import { Background } from "../components/Background";
import { ComponentManager } from "../interface";

export class DefaultComponentManager implements ComponentManager {
  constructor(s: Scene) {
    const bg = new Background();
    bg.scene = s;
    this.components = [bg];
  }
  components: Component[];
  addComponent(c: Component): void {
    this.components.push(c);
  }
}

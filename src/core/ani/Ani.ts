import { Component } from "../component/Component";

export class Ani {
  component?: Component = new Component();
  getComponent(sec: number) {
    return this.component;
  }
  setup() {
    this.children.forEach((child: Component | Ani) => {
      child.setup();
    });
  }
  children?: (Ani | Component)[] = [];
}

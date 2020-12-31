import { Component } from "../component/Component";

export class Ani {
  component?: Component = new Component();
  getComponent(sec: number) {
    return this.component;
  }
  children?: (Ani | Component)[] = [];
}

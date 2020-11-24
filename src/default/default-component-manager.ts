import { Background } from "../components/background";
import { Component } from "../components";
import { ComponentManager } from "../base/component-manager";

export class DefaultComponentManager implements ComponentManager {
  components: Component[] = [new Background()];
  addComponent(c: Component): void {
    this.components.push(c);
  }
}

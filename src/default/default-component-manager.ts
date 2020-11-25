import { Component } from "../components";
import { Background } from "../components/background";
import { ComponentManager } from "../interface";

export class DefaultComponentManager implements ComponentManager {
  components: Component[] = [new Background()];
  addComponent(c: Component): void {
    this.components.push(c);
  }
}

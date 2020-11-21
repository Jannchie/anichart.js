import { Base } from ".";
import { Component } from "./component";

export class Group extends Base {
  components: Component[];
  addComponent(c: Component) {
    this.components.push(c);
    this.reset({});
  }
  preRender(n: number) {
    this.components.forEach((c) => {
      c.preRender(n);
    });
  }
  render(n: number): void {
    this.components.forEach((c) => {
      c.draw(n);
    });
  }
}

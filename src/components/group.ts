import { Base } from "./base";
import { Component } from "./component";
export interface Groupable {
  addComponent(c: Component): void;
  components: Component[];
}

export class GroupComponent extends Base implements Groupable {
  render(n: number): void {
    return;
  }
  components: Base[] = [];
  constructor(options: any) {
    super(options);
    this.reset(options);
  }
  addComponent(c: Base) {
    this.components.push(c);
    c.ani = this.ani;
    this.reset({});
    c.reset({});
    this.ani.hinter.drawHint(`Component Added: ${c.constructor.name}`);
  }
  reset(options?: any) {
    super.reset(options);
    if (this.components) {
      this.components.forEach((c) => {
        c.reset(options);
      });
    }
  }
  draw(n: number) {
    super.draw(n);
    this.components.forEach((c) => {
      c.draw(n);
    });
  }
}

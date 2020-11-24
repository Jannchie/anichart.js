import { Base } from "./base";
import { Component } from "./component";
export interface Groupable {
  addComponent(c: Component): void;
  components: Component[];
}

export class GroupComponent extends Base implements Groupable {
  render(): void {
    return;
  }
  components: Component[] = [];
  constructor(options: any) {
    super(options);
    this.update(options);
  }
  addComponent(c: Base) {
    this.components.push(c);
    c.hinter = this.hinter;
    this.hinter.drawHint(`Component Added: ${c.constructor.name}`);
  }
  update(options: any = {}) {
    super.update(options);
    if (this.components) {
      this.components.forEach((c) => {
        c.player = this.player;
        c.ctx = this.ctx;
        c.renderer = this.renderer;
        this.hinter.drawHint(`Update Component: ${c.constructor.name}`);
        c.update(options);
      });
    }
  }
  draw() {
    super.draw();
    this.components.forEach((c) => {
      c.draw();
    });
  }
}

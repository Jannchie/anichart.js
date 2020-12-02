import { BaseOptions } from "../options/base-options";
import { BaseComponent } from "./BaseComponent";
import { Component } from "./component";
export interface Groupable {
  addComponent(c: Component): void;
  components: Component[];
  updateChild(): void;
}

export class GroupComponent extends BaseComponent implements Groupable {
  render(): void {
    return;
  }
  components: Component[] = [];
  constructor(options: BaseOptions = {}) {
    super(options);
    this.update();
  }
  addComponent(c: BaseComponent) {
    this.components.push(c);
    this.hinter.drawHint(`Component Added: ${c.constructor.name}`);
  }
  update() {
    super.update();
    this.updateChild();
  }

  updateChild() {
    if (this.components) {
      this.components.forEach((c) => {
        c.scene = this.scene;
        this.hinter.drawHint(`Update Component: ${c.constructor.name}`);
        c.update();
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

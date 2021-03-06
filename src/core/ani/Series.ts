import { scaleQuantize, scaleThreshold, sum } from "d3";
import { Component } from "../component/Component";
import { Stage } from "../Stage";
import { Ani } from "./Ani";

export class Scene extends Ani {
  private child: Ani | Component;
  durationSec: number;
  setup(stage: Stage): void {
    super.setup(stage);
    this.child.setup(stage);
  }
  constructor(child: Ani | Component, durationSec: number) {
    super();
    this.child = child;
    this.durationSec = durationSec;
  }
  getComponent(sec: number) {
    return this.child instanceof Ani
      ? this.child.getComponent(sec)
      : this.child;
  }
}
export class Series extends Component {
  children: Scene[] = [];

  addScene(scene: Scene) {
    scene.offsetSec += sum(this.children, (d) => d.durationSec);
    scene.parent = this;
    this.children.push(scene);
  }
  setup(stage: Stage): void {
    super.setup(stage);
    this.children.forEach((child) => {
      child.setup(stage);
    });
  }
}

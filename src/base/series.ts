import * as d3 from "d3";
import { Scene } from "./scene";

export class Series {
  scenes: Scene[] = [];
  play() {
    let delay = 0;
    this.scenes.forEach(async (s) => {
      d3.timeout(() => {
        s.play();
      }, delay);
      delay += s.sec * 1000;
    });
  }
}

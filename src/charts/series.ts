import { Scene } from "./scene";

class Series {
  scenes: Scene[];
  play() {
    this.scenes.forEach((s) => {
      s.play();
    });
  }
}

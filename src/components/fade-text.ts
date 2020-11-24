import { scaleLinear } from "d3-scale";
import { FadeTextOptions } from "../options/fade-text-options";
import { Text } from "./text";
class FadeText extends Text {
  time: number;
  fade: number;
  last: number;
  constructor(options: FadeTextOptions) {
    super(options);
  }
  update(options: FadeTextOptions = {}) {
    super.update(options);
    // 计算显示时间
    if (this.time !== undefined) {
      const fade = this.fade != undefined ? this.fade : 0;
      const last = this.last != undefined ? this.last : 2;
      this.alpha = scaleLinear(
        [
          this.time - fade,
          this.time,
          this.time + last,
          this.time + last + fade,
        ],
        [0, 1, 1, 0]
      ).clamp(true);
    }
  }
}
export { FadeText };

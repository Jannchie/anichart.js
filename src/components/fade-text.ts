import { scaleLinear } from "d3-scale";
import { Text } from "./text";
class FadeText extends Text {
  constructor(options: any) {
    super(options);
    // 计算显示时间
    if (options.time !== undefined) {
      let fade = options.fade != undefined ? options.fade : 0;
      let last = options.last != undefined ? options.last : 2;
      this.alpha = scaleLinear(
        [
          options.time - fade,
          options.time,
          options.time + last,
          options.time + last + fade,
        ],
        [0, 1, 1, 0]
      ).clamp(true);
    }
  }
}
export { FadeText };

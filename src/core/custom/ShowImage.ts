import * as d3 from "d3";
import { Ani } from "../ani/Ani";
import { Image } from "../component/Image";
import { customInOut } from "../util/Ease";
import { addFadeWrapper } from "../wrapper/Fade";
import { addScaleWrapper } from "../wrapper/Scale";

export function showImage({
  path = "",
  position = { x: 250, y: 250 },
  shape = { width: 500, height: 500 },
  time = 0,
  freezeTime = 2,
  center = null,
  animation = "scale" as "scale" | "fade",
  animationTime = 0.5,
  ease = d3.easeElasticOut,
}) {
  const ani = new Ani();
  const img = new Image({ path, position, shape });
  if (!center) img.center = { x: shape.width / 2, y: shape.height / 2 };
  let wrapped: Ani;
  if (animation === "scale") {
    wrapped = addScaleWrapper(
      img,
      customInOut(
        [
          time,
          time + animationTime,
          time + animationTime + freezeTime,
          time + animationTime * freezeTime + freezeTime,
        ],
        [0, 1],
        [ease, ease]
      )
    );
  } else {
    wrapped = addFadeWrapper(
      img,
      customInOut([
        time,
        time + animationTime,
        time + animationTime + freezeTime,
        time + animationTime * freezeTime + freezeTime,
      ])
    );
  }
  ani.children.push(wrapped);
  ani.getComponent = (sec) => {
    return wrapped.getComponent(sec);
  };
  return ani;
}

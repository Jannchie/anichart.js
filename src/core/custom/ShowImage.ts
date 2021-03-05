import { easeElasticOut } from "d3";
import { Ani } from "../ani/Ani";
import { Image } from "../component/Image";
import { customInOut } from "../util/Ease";
import { getFadeWrapped } from "../wrapper/Fade";
import { getScaleWrapped } from "../wrapper/Scale";

export function showImage({
  src = "",
  position = { x: 250, y: 250 },
  shape = { width: 500, height: 500 },
  time = 0,
  freezeTime = 2,
  center = null,
  animation = "scale" as "scale" | "fade",
  animationTime = 0.5,
  ease = easeElasticOut,
}) {
  const ani = new Ani();
  const img = new Image({ src, position, shape });
  if (!center) img.center = { x: shape.width / 2, y: shape.height / 2 };
  let wrapped: Ani;
  if (animation === "scale") {
    wrapped = getScaleWrapped(
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
    wrapped = getFadeWrapped(
      img,
      customInOut([
        time,
        time + animationTime,
        time + animationTime + freezeTime,
        time + animationTime * freezeTime + freezeTime,
      ])
    );
  }
  // ani.children.push(wrapped);
  ani.getComponent = (sec) => {
    return wrapped.getComponent(sec);
  };
  return ani;
}

import { canvasHelper } from "../CanvasHelper";
import { Component } from "../component/Component";
import { Rect } from "../component/Rect";
import { FontWeight, TextAlign, TextBaseline, Text } from "../component/Text";
import { font } from "../Constant";

export function getTextWithBackground({
  txt = "在此处输入文字！",
  position = { x: 100, y: 100 },
  fontSize = 24,
  fontWeight = "bold" as FontWeight,
  textAlign = "right" as TextAlign,
  textBaseline = "top" as TextBaseline,
  foregroundStyle = "#1e1e1e",
  backgroundStyle = "#fff",
  padding = { top: 5, bottom: 0, left: 5, right: 5 },
}) {
  const res = new Component({
    position,
  });
  const text = new Text({
    text: txt,
    position: { x: padding.left, y: padding.top },
    fillStyle: foregroundStyle,
    font,
    fontSize,
    textBaseline,
    fontWeight,
    textAlign,
  });
  const width = canvasHelper.measure(text)?.width;
  const rect = new Rect({
    clip: true,
    shape: {
      width: width + text.position.x + padding.left + padding.right,
      height: fontSize + padding.top + padding.bottom,
    },
    fillStyle: backgroundStyle,
  });
  if (textAlign === "right") {
    text.position.x += width;
  }
  res.center = { x: rect.shape.width / 2, y: rect.shape.height / 2 };
  rect.children.push(text);
  res.children.push(rect);
  return res;
}

let fs: {
  readdirSync: (arg0: any) => any;
  writeFileSync: (arg0: string, arg1: any) => void;
};
if (typeof window === "undefined") {
  // tslint:disable-next-line:no-var-requires
  fs = require("fs");
}

import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
export type Preset =
  | "ultrafast"
  | "superfast"
  | "veryfast"
  | "faster"
  | "fast"
  | "medium"
  | "slow"
  | "slower"
  | "veryslow"
  | "placebo ";
export const ffmpeg = createFFmpeg({ log: true });
export async function addFrameToFFmpeg(
  canvas: HTMLCanvasElement,
  frame: number,
  name = "output",
  qulity = 1
) {
  // const imageData = canvas
  //   .getContext("2d")
  //   .getImageData(0, 0, canvas.width, canvas.height)
  const imageData = canvas.toDataURL("image/png", qulity);
  ffmpeg.FS("writeFile", `${name}-${frame}.png`, await fetchFile(imageData));
}
export async function outputMP4(
  fps: any,
  name = "output",
  preset: Preset = "ultrafast",
  tune = "animation"
) {
  const out = `mp4`;
  await ffmpeg.run(
    "-r",
    `${fps}`,
    `-i`,
    `${name}-%d.png`,
    `-c:v`,
    `libx264`,
    `-preset`,
    preset,
    `-tune`,
    tune,
    `${name}.${out}`
  );
  const data = ffmpeg.FS("readFile", `./${name}.${out}`);
  downloadBlob(new Blob([data.buffer], { type: "video/mp4" }), name);
}
function downloadBlob(blob: Blob, name = "untitled.mp4") {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.style.display = "none";
  a.href = url;
  a.download = `${name}`;
  a.click();
  window.URL.revokeObjectURL(url);
}

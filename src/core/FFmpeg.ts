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
  imageData: string,
  frame: number,
  name = "output"
) {
  ffmpeg.FS("writeFile", `${name}-${frame}.png`, await fetchFile(imageData));
}
export function removePNG(list: string[]) {
  for (const name of list) {
    ffmpeg.FS("unlink", name);
  }
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

let fs;
if (typeof window === "undefined") {
  fs = require("fs");
}
import { createFFmpeg } from "@ffmpeg/ffmpeg";

export const ffmpeg = createFFmpeg({
  log: true,
});

export async function addFrameToFFmpeg(
  ffmpeg,
  canvas,
  frame,
  name = "output",
  qulity = 1
) {
  await ffmpeg.write(
    `${name}-${frame}.png`,
    canvas.toDataURL("image/png", qulity)
  );
}
export async function outputMP4(ffmpeg, fps, name = "output") {
  await ffmpeg.run(`-r ${fps} -threads ${16} -i ${name}-%d.png ${name}.mp4`);
  let data = await ffmpeg.read(`./${name}.mp4`);
  this.downloadBlob(new Blob([data.buffer], { type: "video/mp4" }), name);
}

export async function pngToMp4(pngPath, name, fps, thread = 16) {
  await ffmpeg.load();
  let out = "mp4";
  let nameList = fs.readdirSync(pngPath);
  for (let name of nameList) {
    await ffmpeg.write(name, `${pngPath}${name}`);
  }
  await ffmpeg.run(
    `-r ${fps} -threads ${thread} -i ${name}-%d.png -c:v libx264 -preset ultrafast -tune animation ${name}.${out}`
  );
  const data = await ffmpeg.read(`${name}.${out}`);
  fs.writeFileSync(`${name}.${out}`, data);
  process.exit(0);
}

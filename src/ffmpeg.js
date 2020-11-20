import fs from "fs";
import { createFFmpeg } from "@ffmpeg/ffmpeg";

const ffmpeg = createFFmpeg({
  log: true,
});

async function pngToMp4(pngPath, name, fps, thread = 16) {
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
export { ffmpeg, pngToMp4 };

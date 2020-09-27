import { ffmpeg_webm } from "ffmpeg.js";
ffmpeg_webm({
  arguments: [
    "-pattern_type",
    "glob",
    "-i",
    "/image/test-frame*.png",
    "/out/out.webm",
  ],
  print: noop,
  printErr: noop,
  mounts: [{ type: "NODEFS", opts: { root: "test" }, mountpoint: "/data" }],
});

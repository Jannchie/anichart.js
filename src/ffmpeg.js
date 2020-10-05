const ffmpeg = require("ffmpeg");
function noop(e) {
  console.log(e);
}
ffmpeg({
  arguments: [
    "-r",
    "60",
    "-i",
    "/data/image/undefined-2038.png ",
    "/data/out/out.mp4",
  ],
  print: noop,
  printErr: noop,
  mounts: [{ type: "NODEFS", opts: { root: "." }, mountpoint: "/data" }],
});
//ffmpeg -r 60 -i ./image/undefined-%d.png ./out/out.mp4

let toMp4 = require("../src/ffmpeg");
(async () => {
  toMp4("./image/", "fans-increase", "./out.mp4", 24)
})()
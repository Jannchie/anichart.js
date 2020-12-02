module.exports = async function makeVideo(a) {
  if (typeof window !== "undefined") {
    return;
  }
  let cmd = `ffmpeg -r ${a.frameRate} -threads ${16} -i ${a.imagePath}${
    a.outputName
  }-%d.png  -c:v libx264 -preset ultrafast -tune animation  ${
    a.outputName
  }.mp4 -y`;
  console.log(cmd);
  const child = exec(cmd);
  child.stdout.on("data", function (data) {
    console.log(data.toString());
  });

  child.stderr.on("data", function (data) {
    console.log(data.toString());
  });
};

let load;
const async = require("async");

if (typeof window != "undefined") {
  const { Image } = require("@canvas/image");
  load = function (url) {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        resolve(image);
      };
      image.src = url;
    });
  };
} else {
  let { loadImage } = require("canvas");
  load = loadImage;
}

async function loadImages(metaData, imageDict, imageData, anichart) {
  let all = Object.entries(metaData).length;
  let c = 0;
  let imgMap = imageDict(metaData, anichart);
  var wait = (ms) => new Promise((reslove, reject) => setTimeout(reject, ms));
  await async.mapValues(imgMap, async (src, key) => {
    let count = 0;
    while (true) {
      try {
        await Promise.race([
          loadImageFromSrcAndKey(src, key, imageData),
          wait(5000),
        ]);
        break;
      } catch (e) {
        if (++count >= 10) {
          console.log("Over the number of retries! ");
          console.log("Src:" + src);
          break;
        }
        console.log(`Timeout! Reload Image..times:${count}`);
        console.log(e);
      }
    }
    anichart.hintText(`Loading Images ${++c}/ ${all}`);
  });
  console.log("image Loaded");
}

async function loadImageFromSrcAndKey(src, key, imageData) {
  imageData[key] = await load(src);
  if (typeof window != "undefined") {
    imageData[key].setAttribute("crossOrigin", "Anonymous");
  }
}
module.exports = loadImages;

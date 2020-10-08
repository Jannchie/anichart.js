const { Image } = require("@canvas/image");
let { loadImage } = require("canvas");
const async = require("async");

if (typeof window == 'undefined') {
  loadImage = loadImage;
} else {
  loadImage = function (url) {
    return new Promise(resolve => {
      const image = new Image();
      image.onload = () => {
        resolve(image);
      };
      image.src = url;
    });
  }
}

async function loadImages(metaData, imageDict, imageData, anichart) {
  let all = Object.entries(metaData).length;
  let c = 0;
  let imgMap = imageDict(metaData, anichart);
  var wait = ms => new Promise((reslove, reject) => setTimeout(reject, ms));
  await async.mapValues(imgMap, async (src, key) => {
    let count = 0
    while (true) {
      try {
        await Promise.race([loadImageFromSrcAndKey(src, key, imageData), wait(3000)]);
        break;
      } catch (e) {
        if (++count >= 5) {
          console.log("Over the number of retries! ");
          console.log("Src:" + src);
          break;
        }
        console.log(`Timeout! Reload Image..times:${count}`);
      }
    }
    anichart.hintText(`Loading Images ${++c}/ ${all}`);
  })
  console.log("image Loaded");
}


async function loadImageFromSrcAndKey(src, key, imageData) {
  imageData[key] = await loadImage(src);
  if (!this.node) {
    imageData[key].setAttribute("crossOrigin", "Anonymous");
  }
}
module.exports = loadImages;
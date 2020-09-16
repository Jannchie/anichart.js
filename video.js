// Create an export button

var context = canvas.node().getContext("2d");

var video = new Whammy.Video(frameRate);

// Get the string representation of a DOM node (removes the node)
function domNodeToString(domNode) {
  // var element = document.createElement("div");
  // element.appendChild(domNode);
  // return element.innerHTML;
  return domNode.outerHTML;
}

var DOMURL = window.URL || window.webkitURL || window;

var svgString = domNodeToString(svg.node());
var frames = [];
let v = null;
var cnt = 0;
var timer = d3.timer(() => {
  if (finished) {
    timer.stop();
    setTimeout(() => {
      console.log("stopping");
      // frames.forEach((frame) => {
      //   var link = document.createElement("a");
      //   link.innerHTML = "download image";
      //   link.addEventListener(
      //     "click",
      //     function (ev) {
      //       link.href = frame;
      //       link.download = "t.png";
      //     },
      //     false
      //   );
      //   link.click();
      // });
      rec();
      // mediaRecorder.stop();
    }, 100);
  }
  var svgString = domNodeToString(svg.node());
  v = canvg.Canvg.fromString(context, svgString);
  v.start();

  var image = canvas.node().toDataURL();
  // console.log(image);
  video.add(context);
});

const cvs = document.querySelector("canvas");
if (showPreview) {
  const stream = cvs.captureStream();
  const vdo = d3
    .select("body")
    .append("video")
    .attr("controls", true)
    .attr("autoplay", true)
    .node();
  vdo.srcObject = stream;
}

// var stream = canvas.node().captureStream(25);

// var options = {
//   audioBitsPerSecond: 0,
//   videoBitsPerSecond: 500000,
//   mimeType: "video/webm; codecs=vp9",
// };
// mediaRecorder = new MediaRecorder(stream, options);
// var recordedChunks = [];
// mediaRecorder.ondataavailable = handleDataAvailable;
// mediaRecorder.start();

// function handleDataAvailable(event) {
//   console.log("data-available");
//   if (event.data.size > 0) {
//     recordedChunks.push(event.data);
//     console.log(recordedChunks);
//     download();
//   } else {
//     // ...
//   }
// }

// function download() {
//   var blob = new Blob(recordedChunks, {
//     type: "video/webm",
//   });
//   var url = URL.createObjectURL(blob);
//   var a = document.createElement("a");
//   document.body.appendChild(a);
//   a.style = "display: none";
//   a.href = url;
//   a.download = "test.webm";
//   a.click();
//   window.URL.revokeObjectURL(url);
// }
async function rec() {
  var blob = video.compile();
  console.log(blob);
  // let webmEncoder = new Whammy.Video();
  // frames.forEach((f) => webmEncoder.add(f));
  // let blob = await new Promise((resolve) =>
  //   webmEncoder.compile(false, resolve)
  // );

  // let blob = Whammy.fromImageArray(frames, 30);
  // let videoBlobUrl = URL.createObjectURL(blob);
  // console.log(videoBlobUrl);
  console.log(URL.createObjectURL(blob));
  d3.select("body")
    .append("video")
    .attr("controls", true)
    .attr("autoplay", true)
    .attr("src", URL.createObjectURL(blob))
    .node();
  // downloadBlob(blob);
}

function downloadBlob(blob) {
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  a.href = url;
  a.download = "test.webm";
  a.click();
  window.URL.revokeObjectURL(url);
}

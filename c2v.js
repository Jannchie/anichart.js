// Create an export button

var context = canvas.getContext("2d");

var video = new Whammy.Video(frameRate);

var DOMURL = window.URL || window.webkitURL || window;

var frames = [];
let v = null;
var cnt = 0;
var timer = d3.timer(() => {
  cnt++;
  if (cnt >= 1000) {
    timer.stop();
    setTimeout(() => {
      console.log("stopping");
      rec();
    }, 100);
  }
  var image = canvas.toDataURL();
  // console.log(image);
  video.add(context);
});

const cvs = document.querySelector("canvas");
if (true) {
  const stream = cvs.captureStream();
  const vdo = d3
    .select("body")
    .append("video")
    .attr("controls", true)
    .attr("autoplay", true)
    .node();
  vdo.srcObject = stream;
}

async function rec() {
  var blob = video.compile();
  console.log(blob);

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

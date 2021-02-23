declare var MediaRecorder: any;
export class Recorder {
  record(canvas: any, time: number) {
    const recordedChunks = [] as any[];
    return new Promise((res, _) => {
      const stream = canvas.captureStream(60 /*fps*/);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm; codecs=vp9",
      });

      // on data available will fire in interval of `time || 4000 ms`
      mediaRecorder.start(time || 4000);

      mediaRecorder.onDataAvailable = (e: any) => {
        recordedChunks.push(e.data);
        if (mediaRecorder.state === "recording") {
          // after stop data available event run one more time
          mediaRecorder.stop();
        }
      };

      mediaRecorder.onstop = (event: any) => {
        const blob = new Blob(recordedChunks, {
          type: "video/webm",
        });
        const url = URL.createObjectURL(blob);
        res(url);
      };
    });
  }
}

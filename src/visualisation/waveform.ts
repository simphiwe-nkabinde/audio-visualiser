/**
 * 
 * @param canvasCtx 
 * @param canvasWidth 
 * @param canvasHeight 
 * @param bufferLength 
 * @param dataArray 
 * @param getByteData 
 */
export default function waveForm(canvasCtx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, bufferLength: number, dataArray: Uint8Array, getByteData: Function) {
  canvasCtx?.clearRect(0, 0, canvasWidth, canvasHeight);
  function draw() {
    requestAnimationFrame(() => draw());
    getByteData(dataArray);

    canvasCtx!.fillStyle = "rgb(0 0 0)";
    canvasCtx!.fillRect(0, 0, canvasWidth, canvasHeight);

    canvasCtx!.lineWidth = 2;
    canvasCtx!.strokeStyle = "rgb(200 50 50)";
    canvasCtx?.beginPath();

    const sliceWidth = canvasWidth / bufferLength;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = v * (canvasHeight / 2);

      if (i == 0) canvasCtx?.moveTo(x, y)
      else canvasCtx?.lineTo(x, y)
      x += sliceWidth;
    }

    canvasCtx?.lineTo(canvasWidth, canvasHeight / 2);
    canvasCtx?.stroke()
  }
  draw()
};

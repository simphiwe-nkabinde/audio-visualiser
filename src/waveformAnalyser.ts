const audio : HTMLAudioElement = document.querySelector('#audio-1')!;
const audioCtx = new AudioContext();
const analyser = audioCtx.createAnalyser();
const sourceNode = audioCtx.createMediaElementSource(audio);
sourceNode.connect(analyser);
analyser.connect(audioCtx.destination)

analyser.fftSize = 2048;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

const canvas: HTMLCanvasElement = document.querySelector('#canvas-1')!;
const canvasCtx = canvas?.getContext('2d');
const WIDTH = canvas!.width
const HEIGHT = canvas!.height;
canvasCtx?.clearRect(0, 0, WIDTH, HEIGHT);

function draw1() {
  requestAnimationFrame(draw1);
  analyser.getByteTimeDomainData(dataArray);
  canvasCtx!.fillStyle = "rgb(0 0 0)";
  canvasCtx?.fillRect(0, 0, WIDTH, HEIGHT);

  canvasCtx!.lineWidth = 2;
  canvasCtx!.strokeStyle = "rgb(200 50 50)";
  canvasCtx?.beginPath();

  const sliceWidth = WIDTH / bufferLength;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const v = dataArray[i] / 128.0;
    const y = v * (HEIGHT / 2);

    if (i == 0) {
      canvasCtx?.moveTo(x, y)
    } else {
      canvasCtx?.lineTo(x, y)
    }

    x += sliceWidth;

  }

  canvasCtx?.lineTo(WIDTH, HEIGHT / 2);
  canvasCtx?.stroke()
}
export default draw1
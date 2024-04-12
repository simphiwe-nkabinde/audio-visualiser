const audio: HTMLAudioElement = document.querySelector('#audio-2')!;
const audioCtx = new AudioContext();
const analyser = audioCtx.createAnalyser();
const sourceNode = audioCtx.createMediaElementSource(audio);
sourceNode.connect(analyser);
analyser.connect(audioCtx.destination);

analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

const canvas: HTMLCanvasElement = document.querySelector('#canvas-2')!;
const canvasCtx = canvas?.getContext('2d');
const WIDTH = canvas!.width
const HEIGHT = canvas!.height;
canvasCtx?.clearRect(0, 0, WIDTH, HEIGHT);

function draw2(xpos = 0) {
  const newXpos = xpos > WIDTH ? 0 : xpos + 1
  requestAnimationFrame(() => draw2(newXpos));
  analyser.getByteTimeDomainData(dataArray);
  canvasCtx!.fillStyle = "rgb(0 0 0)";
  canvasCtx?.fillRect(0, 0, WIDTH, HEIGHT);

  const barWidth = WIDTH / bufferLength * 1.5;
  let barHeight;
  let x = 0;
  let highest = 0;
  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i] * 2;
    if (barHeight > highest) highest = barHeight


    canvasCtx!.fillStyle = `rgb(${barHeight + 100} 50 50)`;
    canvasCtx?.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

    x += barWidth + 2;

  }
  drawStroller(canvasCtx!, xpos, highest)
}

function drawStroller(canvasCtx: CanvasRenderingContext2D, xpos: number, ypos: number) {
  if (xpos % 2 == 0) {
    canvasCtx!.fillStyle = `rgb(100 100 100)`;
    canvasCtx?.fillRect(xpos, HEIGHT - (ypos + 30), 10, 20)
  }
}

export default draw2
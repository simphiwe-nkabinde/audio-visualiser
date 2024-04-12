const audio: HTMLAudioElement = document.querySelector('#audio-3')!;
const audioCtx = new AudioContext();
const analyser = audioCtx.createAnalyser();
const sourceNode = audioCtx.createMediaElementSource(audio);
sourceNode.connect(analyser);
analyser.connect(audioCtx.destination)

analyser.fftSize = 512;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

const canvas: HTMLCanvasElement = document.querySelector('#canvas-3')!;
const canvasCtx = canvas?.getContext('2d');
const WIDTH = canvas!.width
const HEIGHT = canvas!.height;
canvasCtx?.clearRect(0, 0, WIDTH, HEIGHT);

function draw3(xpos = 0) {
    const newXpos = xpos > WIDTH ? 0 : xpos + 1
    requestAnimationFrame(() => draw3(newXpos));

    analyser.getByteFrequencyData(dataArray);

    canvasCtx!.fillStyle = "rgb(0 0 0)";
    canvasCtx!.fillRect(0, 0, WIDTH, HEIGHT);

    const barWidth = (WIDTH / bufferLength) * 2.5;
    let barHeight;
    let x = 0;
    let highest = 0;

    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        if (barHeight > highest) highest = barHeight

        canvasCtx!.fillStyle = `rgb(${barHeight + 100} 50 50)`;
        canvasCtx!.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);

        x += barWidth + 1;
    }
    drawStroller(canvasCtx!, xpos, highest)
}

function drawStroller(canvasCtx: CanvasRenderingContext2D, xpos: number, ypos: number) {
    canvasCtx!.fillStyle = `rgb(100 100 100)`;
    canvasCtx?.fillRect(xpos, HEIGHT - (ypos), 10, 20)
}
export default draw3;
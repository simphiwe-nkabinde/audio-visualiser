import './style.css'
import { BarGraphVisualiser } from './classes/visualisers/BarGraphVisualiser';
import { waveformVisualiser } from './classes/visualisers/WaveformVisualiser';
import { BubbleChaosVisualiser } from './classes/visualisers/BubbleChaosVisualiser';

document.querySelector('#start-btn')!.addEventListener('click', (e) => {
  document.querySelector('#overlay')!.remove();
  visualizer();
})
function visualizer() {

  //audio
  const audio: HTMLAudioElement = document.querySelector('#audio-bubbles')!;
  const audioCtx = new AudioContext();
  const analyser = audioCtx.createAnalyser();
  const sourceNode = audioCtx.createMediaElementSource(audio);
  sourceNode.connect(analyser);
  analyser.connect(audioCtx.destination);

  analyser.fftSize = 512;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const WIDTH = window.innerWidth / 3;
  const HEIGHT = window.innerHeight / 2;

  const [canvas1, canvas2, canvas3] = document.querySelectorAll('canvas'!);
  canvas1.width = WIDTH
  canvas1.height = HEIGHT
  const canvasCtx1 = canvas1.getContext('2d')!;

  canvas2.width = WIDTH
  canvas2.height = HEIGHT
  const canvasCtx2 = canvas2.getContext('2d')!;

  canvas3.width = WIDTH
  canvas3.height = HEIGHT
  const canvasCtx3 = canvas3.getContext('2d')!;

  new waveformVisualiser(canvasCtx1, { width: WIDTH, height: HEIGHT }, bufferLength, dataArray, (data) => analyser.getByteTimeDomainData(data));
  new BarGraphVisualiser(canvasCtx2, { width: WIDTH, height: HEIGHT }, bufferLength, dataArray, (data) => analyser.getByteFrequencyData(data));
  new BubbleChaosVisualiser(canvasCtx3, { width: WIDTH, height: HEIGHT }, bufferLength, dataArray, (data) => analyser.getByteFrequencyData(data))

}
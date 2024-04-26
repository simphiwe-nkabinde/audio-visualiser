import './style.css'
import CirclesInSpaceVisualiser from './classes/visualisers/CirclesInSpaceVisualiser';
import BarGraphVisualiser from './classes/visualisers/BarGraphVisualiser';
import waveformVisualiser from './classes/visualisers/WaveformVisualiser';
import BubbleChaosVisualiser from './classes/visualisers/BubbleChaosVisualiser';
import { AudioOptions } from './interfaces/interfaces';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './globals';

document.querySelector('#start-btn')!.addEventListener('click', (e) => {
    document.querySelector('#overlay')!.remove();
    visualizer();
})
function visualizer() {

    //audio
    const audio: HTMLAudioElement = document.querySelector('audio')!;
    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    const sourceNode = audioCtx.createMediaElementSource(audio);
    sourceNode.connect(analyser);
    analyser.connect(audioCtx.destination);

    analyser.fftSize = 512;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const [canvas1, canvas2, canvas3, canvas4] = document.querySelectorAll('canvas')!;
    canvas1.width = SCREEN_WIDTH;
    canvas1.height = SCREEN_HEIGHT;
    canvas2.width = SCREEN_WIDTH;
    canvas2.height = SCREEN_HEIGHT;
    canvas3.width = SCREEN_WIDTH;
    canvas3.height = SCREEN_HEIGHT;
    canvas4.width = SCREEN_WIDTH;
    canvas4.height = SCREEN_HEIGHT;

    const canvasCtx1 = canvas1.getContext('2d')!;
    const canvasCtx2 = canvas2.getContext('2d')!;
    const canvasCtx3 = canvas3.getContext('2d')!;
    const canvasCtx4 = canvas4.getContext('2d')!;

    const frequncyDataAudioOptions: AudioOptions = {
        bufferLength,
        dataArray,
        getByteDataCallback: (data) => analyser.getByteFrequencyData(data),
        duration: audio.duration
    }
    const timeDomainDataAudioOptions: AudioOptions = {
        bufferLength,
        dataArray,
        getByteDataCallback: (data) => analyser.getByteTimeDomainData(data),
        duration: audio.duration
    }

    const circlesInSpace = new CirclesInSpaceVisualiser(canvasCtx1, frequncyDataAudioOptions);
    circlesInSpace.renderVisualisation();
    const waveForm = new waveformVisualiser(canvasCtx2, timeDomainDataAudioOptions);
    waveForm.renderVisualisation();
    const barGraph = new BarGraphVisualiser(canvasCtx3, frequncyDataAudioOptions);
    barGraph.renderVisualisation();
    const bubbleChaos = new BubbleChaosVisualiser(canvasCtx4, frequncyDataAudioOptions);
    bubbleChaos.renderVisualisation();

}
import './style.css'
import { AudioOptions } from './interfaces/interfaces';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './globals';
import Umsebenzi from './classes/projects/Umsebenzi';

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

    const canvas= document.querySelector('canvas')!;
    canvas.width = SCREEN_WIDTH;
    canvas.height = SCREEN_HEIGHT;
    const canvasCtx = canvas.getContext('2d')!;

    const frequncyDataAudioOptions: AudioOptions = {
        bufferLength,
        dataArray,
        getByteDataCallback: (data) => analyser.getByteFrequencyData(data),
        duration: audio.duration
    }

    const circlesInSpace = new Umsebenzi(canvasCtx, frequncyDataAudioOptions);
    circlesInSpace.renderVisualisation();
}
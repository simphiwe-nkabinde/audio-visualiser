import { AudioOptions } from './../interfaces/interfaces';

export abstract class Visualiser {
    canvasCtx: CanvasRenderingContext2D;
    audioOptions: AudioOptions

    constructor(canvasCtx: CanvasRenderingContext2D, audiOptions: AudioOptions) {
        this.canvasCtx = canvasCtx;
        this.audioOptions = audiOptions
    }
    abstract renderVisualisation(): void
}
import { Dimensions } from "../interfaces/interfaces";

export abstract class Visualiser {
    canvasCtx: CanvasRenderingContext2D;
    canvasSize: Dimensions;
    getByteDataCallback: (Uint8Array: Uint8Array) => void;
    bufferLength: number;
    dataArray: Uint8Array;

    constructor(canvasCtx: CanvasRenderingContext2D, canvasSize: Dimensions, bufferLength: number, dataArray: Uint8Array, getByteDataCallback: (Uint8Array: Uint8Array) => void) {
        this.canvasCtx = canvasCtx;
        this.canvasSize = canvasSize;
        this.bufferLength = bufferLength;
        this.dataArray = dataArray;
        this.getByteDataCallback = getByteDataCallback;
        
        this.renderVisualisation()
    }
    abstract renderVisualisation(): void
}
export interface Position {
    x: number,
    y: number,
    z: number
}

export interface BubbleOptions {
    radius?: number;
    velocity?: Position;
}

export interface Dimensions {
    width: number;
    height: number;
}

export interface AudioOptions {
    bufferLength: number;
    dataArray: Uint8Array;
    getByteDataCallback: (Uint8Array: Uint8Array) => void;
    duration: number
}
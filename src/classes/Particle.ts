import { FOCAL_LENGTH, TRUE_ORIGIN } from "../globals";
import { Position } from "../interfaces/interfaces";

export class Particle {
    canvasCtx: CanvasRenderingContext2D;
    position: Position;
    fillRGBA: number[];
    width: number;
    height: number;
    constructor(canvasCtx: CanvasRenderingContext2D, options: { position?: Position, fillRGBA?: number[], width?: number, height?: number }) {
        this.canvasCtx = canvasCtx
        this.position = options.position || { x: 0, y: 0, z: 0 }
        this.fillRGBA = options.fillRGBA || [255, 0, 0, 1]
        this.width = options.width || 10;
        this.height = options.height || 10;
    }
    draw() {
        const projectedX = this.getProjectedValue(this.position.x);
        const projectedY = this.getProjectedValue(this.position.y);
        const projectedWidth = this.getProjectedValue(this.width);
        const projectedHeight = this.getProjectedValue(this.height);

        this.canvasCtx.fillStyle = `rgba(${this.fillRGBA.toString()})`;
        this.canvasCtx.fillRect(TRUE_ORIGIN.x + projectedX, TRUE_ORIGIN.y + projectedY, projectedWidth, projectedHeight);
    }
    update() {
        this.draw()
    }
    getProjectedValue(value: number) {
        const angle = Math.atan((FOCAL_LENGTH - this.position.z) / value) * 180 / Math.PI;
        const pValue = FOCAL_LENGTH / Math.tan(angle * Math.PI / 180);
        return pValue;
    }
    getPosition() {
        return this.position
    }
    setPosition(position: { x?: number, y?: number, z?: number }) {
        this.position = { ...this.position, ...position }
    }
}
import { FOCAL_LENGTH, TRUE_ORIGIN } from "../globals";
import { Position } from "../interfaces/interfaces";

export default class Circle {

    private position: Position;
    private canvasCtx: CanvasRenderingContext2D;
    private radius: number;
    private fillRGBA: number[];

    constructor(canvasCtx: CanvasRenderingContext2D, options: { position?: Position, radius?: number, fillRGBA?: number[] },) {
        this.canvasCtx = canvasCtx;
        this.position = options.position || { x: 0, y: 0, z: 0 };
        this.radius = options.radius || 1;
        this.fillRGBA = options.fillRGBA || [255, 0, 0, 1]

    }

    draw() {
        const projectedX = this.getProjectedValue(this.position.x);
        const projectedY = this.getProjectedValue(this.position.y);
        const projectedRadius = this.getProjectedValue(this.radius)
        this.canvasCtx.beginPath();
        this.canvasCtx.arc(TRUE_ORIGIN.x + projectedX, TRUE_ORIGIN.y + projectedY, Math.abs(projectedRadius), 0, Math.PI * 2, false);
        this.canvasCtx.fillStyle = `rgba(${this.fillRGBA.toString()})`;
        this.canvasCtx.fill();
    }

    update() {
        this.draw();
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
    getRadius() {
        return this.radius
    }

    setRadius(radius: number) {
        this.radius = radius;
    }
    setColorAlpha(alphaValue: number) {
        if (alphaValue >= 1) this.fillRGBA[3] = 1
        else this.fillRGBA[3] = alphaValue
    }
    getColorAlpha() {
        return this.fillRGBA[3]
    }
    getFillRGBA() {
        return this.fillRGBA
    }
    setFillRGBA(rgba: number[]) {
        this.fillRGBA = rgba
    }

}
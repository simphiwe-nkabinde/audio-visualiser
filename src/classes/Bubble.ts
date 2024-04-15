import { BubbleOptions, Position } from "../interfaces/interfaces";

export default class Bubble {

    private position: Position = { x: 0, y: 0 };
    private velocity: Position = { x: 2, y: 2 };
    private acceleration: Position = { x: 0, y: 0 };
    private canvasCtx: CanvasRenderingContext2D;
    private radius: number;
    private bgColor: string;
    private containerWidth: number;
    private containerHeight: number;

    constructor(canvasCtx: CanvasRenderingContext2D, startPosition: Position, radius: number, bgColor: string, containerSize: { width: number, height: number }, startVelocity: Position) {
        this.canvasCtx = canvasCtx;
        this.position = startPosition;
        this.radius = radius;
        this.bgColor = bgColor;
        this.containerHeight = containerSize.height;
        this.containerWidth = containerSize.width;
        this.velocity = startVelocity
    }

    draw() {
        this.canvasCtx.beginPath();
        this.canvasCtx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        this.canvasCtx.shadowBlur = 30;
        this.canvasCtx.shadowOffsetX = this.position.x - (this.containerWidth/2);
        this.canvasCtx.shadowOffsetY =  this.position.y - (this.containerHeight/2);
        this.canvasCtx.shadowColor = "rgba(0, 0, 0, 0.1)";
        this.canvasCtx.fillStyle = this.bgColor;
        this.canvasCtx.fill();
    }
    drawShadow() {
        // if (this.radius < 10) return
        // this.canvasCtx.beginPath();
        // this.canvasCtx.arc(this.position.x + 3, this.position.y-5, 2, 0, Math.PI * 2, false);
        // this.canvasCtx.fillStyle = 'rgba(0, 0, 0)';
        // this.canvasCtx.fill();
    }

    update(bubbleOptions: BubbleOptions) {
        if (this.position.x + this.radius > this.containerWidth || this.position.x - this.radius < 0) {
            this.velocity.x = -this.velocity.x
        }

        if (this.position.y + this.radius > this.containerHeight || this.position.y - this.radius < 0) {
            this.velocity.y = -this.velocity.y
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;


        if (bubbleOptions.radius) this.radius = bubbleOptions.radius;
        if (bubbleOptions.velocity) {
            this.velocity = {
                x: this.velocity.x > 0 ? bubbleOptions.velocity.x : -bubbleOptions.velocity.x,
                y: this.velocity.y > 0 ? bubbleOptions.velocity.y : -bubbleOptions.velocity.y
            }
        }

        
        this.draw();
        this.drawShadow();
    }
    getRadius() {
        return this.radius;
    }

}
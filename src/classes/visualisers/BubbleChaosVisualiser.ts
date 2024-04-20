import colorSchemes from "../../assets/colorSchemes";
import Bubble from "../Bubble";
import { Visualiser } from "../Visualiser";

export class BubbleChaosVisualiser extends Visualiser {
    colorSet = colorSchemes;
    bubbles: Bubble[] = [];
    maxBubbleRadius = 40;

    getBubbles(): Bubble[] {
        const bubbleList: Bubble[] = [];
        for (let i = 0; i < this.bufferLength; i++) {
            const randomColor = colorSchemes[0].colors[Math.floor(Math.random() * 5)];
            const randomStartPosition = this.correctStartPosition(Math.floor(Math.random() * this.canvasSize.width), Math.floor(Math.random() * this.canvasSize.height))
            let polarityX = i % 2 == 0 ? -1 : 1
            let polarityY = i % 3 == 0 ? -1 : 1

            const randomVelocity = {
                x: polarityX * Math.ceil(Math.random() * 3),
                y: polarityY * Math.ceil(Math.random() * 3)
            }
            const bubble = new Bubble(this.canvasCtx, randomStartPosition, 0, randomColor, { width: this.canvasSize.width, height: this.canvasSize.height }, randomVelocity);

            bubbleList.push(bubble);
        }
        return bubbleList
    }
    renderVisualisation() {
        if (!this.bubbles?.length) this.bubbles = this.getBubbles();

        requestAnimationFrame(() => this.renderVisualisation());
        this.getByteDataCallback(this.dataArray)
        this.canvasCtx!.fillStyle = "rgb(255 255 255)";
        this.canvasCtx?.fillRect(0, 0, this.canvasSize.width, this.canvasSize.height);

        const onePart = this.bufferLength / 10;

        for (let i = 0; i < this.bufferLength; i++) {
            const unitAve = this.dataArray[i]
            if (i % 2 == 0) {
                if (i <= onePart) {
                    const newRadius = (this.bubbles[i].getRadius() + (unitAve / 2)) / 2
                    this.bubbles[i].update({ radius: newRadius, velocity: { x: unitAve ** (2 / unitAve), y: unitAve ** (2 / unitAve) } },);
                } else if (i >= onePart * 4 && i <= onePart * 5) {
                    const newRadius = (this.bubbles[i].getRadius() + (unitAve / 3)) / 2
                    this.bubbles[i].update({ radius: newRadius, velocity: { x: unitAve ** (1 / unitAve), y: unitAve ** (1 / unitAve) } },);
                } else if (i >= onePart * 7 && i <= onePart * 8) {
                    const newRadius = (this.bubbles[i].getRadius() + (unitAve / 4)) / 2
                    this.bubbles[i].update({ radius: newRadius, velocity: { x: 2, y: 2 } },);
                } else {
                    this.idleBubble(this.bubbles[i])
                }
            }
        }
    }
    idleBubble(bubble: Bubble) {
        bubble.update({ radius: 5 },)
    }
    correctStartPosition(x: number, y: number) {
        let finalX = x;
        let finalY = y;
        if (finalX < this.maxBubbleRadius) finalX += this.maxBubbleRadius;
        if (this.canvasSize.height - finalX < this.maxBubbleRadius) finalX -= this.maxBubbleRadius;
        if (finalY < this.maxBubbleRadius) finalY += this.maxBubbleRadius;
        if (this.canvasSize.height - finalY < this.maxBubbleRadius) finalY -= this.maxBubbleRadius;
        return { x: finalX, y: finalY }
    }
}
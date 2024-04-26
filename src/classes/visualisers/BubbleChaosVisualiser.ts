import colorSchemes from "../../assets/colorSchemes";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../globals";
import Bubble from "../Bubble";
import { Visualiser } from "../Visualiser";

export default class BubbleChaosVisualiser extends Visualiser {
    colorSet = colorSchemes.one;
    bubbles: Bubble[] = [];
    maxBubbleRadius = 40;

    getBubbles(): Bubble[] {
        const bubbleList: Bubble[] = [];
        for (let i = 0; i < this.audioOptions.bufferLength; i++) {
            const randomColor = <number[]>colorSchemes.one[Math.floor(Math.random() * 5)];
            const randomStartPosition = this.correctStartPosition(Math.floor(Math.random() * SCREEN_WIDTH), Math.floor(Math.random() * SCREEN_HEIGHT))
            let polarityX = i % 2 == 0 ? -1 : 1
            let polarityY = i % 3 == 0 ? -1 : 1

            const randomVelocity = {
                x: polarityX * Math.ceil(Math.random() * 3),
                y: polarityY * Math.ceil(Math.random() * 3),
                z: 0
            }
            const bubble = new Bubble(this.canvasCtx, randomStartPosition, 0, randomColor, { width: SCREEN_WIDTH, height: SCREEN_HEIGHT }, randomVelocity);

            bubbleList.push(bubble);
        }
        return bubbleList
    }
    renderVisualisation() {
        if (!this.bubbles?.length) this.bubbles = this.getBubbles();

        requestAnimationFrame(() => this.renderVisualisation());
        this.audioOptions.getByteDataCallback(this.audioOptions.dataArray)
        this.canvasCtx!.fillStyle = "rgb(255 255 255)";
        this.canvasCtx?.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

        const onePart = this.audioOptions.bufferLength / 10;

        for (let i = 0; i < this.audioOptions.bufferLength; i++) {
            const unitAve = this.audioOptions.dataArray[i]
            if (i % 2 == 0) {
                if (i <= onePart) {
                    const newRadius = (this.bubbles[i].getRadius() + (unitAve / 2)) / 2
                    this.bubbles[i].update({ radius: newRadius, velocity: { x: unitAve ** (2 / unitAve), y: unitAve ** (2 / unitAve), z: 0 } },);
                } else if (i >= onePart * 4 && i <= onePart * 5) {
                    const newRadius = (this.bubbles[i].getRadius() + (unitAve / 3)) / 2
                    this.bubbles[i].update({ radius: newRadius, velocity: { x: unitAve ** (1 / unitAve), y: unitAve ** (1 / unitAve), z: 0 } },);
                } else if (i >= onePart * 7 && i <= onePart * 8) {
                    const newRadius = (this.bubbles[i].getRadius() + (unitAve / 4)) / 2
                    this.bubbles[i].update({ radius: newRadius, velocity: { x: 2, y: 2, z: 0 } },);
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
        if (SCREEN_HEIGHT - finalX < this.maxBubbleRadius) finalX -= this.maxBubbleRadius;
        if (finalY < this.maxBubbleRadius) finalY += this.maxBubbleRadius;
        if (SCREEN_HEIGHT - finalY < this.maxBubbleRadius) finalY -= this.maxBubbleRadius;
        return { x: finalX, y: finalY, z: 0 }
    }
}
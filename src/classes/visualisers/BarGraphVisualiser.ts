import { Visualiser } from "../Visualiser"

export class BarGraphVisualiser extends Visualiser {

    renderVisualisation() {
        requestAnimationFrame(() => this.renderVisualisation());
        this.getByteDataCallback(this.dataArray);

        this.canvasCtx!.fillStyle = "rgb(0 0 0)";
        this.canvasCtx!.fillRect(0, 0, this.canvasSize.width, this.canvasSize.height);

        const barWidth = (this.canvasSize.width / this.bufferLength);
        let x = 0;

        for (let i = 0; i < this.bufferLength; i++) {
            const barHeight = this.dataArray[i];
            this.canvasCtx!.fillStyle = `rgb(${barHeight + 100} 50 50)`;
            this.canvasCtx!.fillRect(x, this.canvasSize.height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        }

    }
}
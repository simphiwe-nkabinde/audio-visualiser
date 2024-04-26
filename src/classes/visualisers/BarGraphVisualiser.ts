import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../globals";
import { Visualiser } from "../Visualiser"

export default class BarGraphVisualiser extends Visualiser {

    renderVisualisation() {
        requestAnimationFrame(() => this.renderVisualisation());
        this.audioOptions.getByteDataCallback(this.audioOptions.dataArray);

        this.canvasCtx!.fillStyle = "rgb(0 0 0)";
        this.canvasCtx!.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

        const barWidth = (SCREEN_WIDTH / this.audioOptions.bufferLength);
        let x = 0;

        for (let i = 0; i < this.audioOptions.bufferLength; i++) {
            const barHeight = this.audioOptions.dataArray[i];
            this.canvasCtx!.fillStyle = `rgb(${barHeight + 100} 50 50)`;
            this.canvasCtx!.fillRect(x, SCREEN_HEIGHT - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        }

    }
}
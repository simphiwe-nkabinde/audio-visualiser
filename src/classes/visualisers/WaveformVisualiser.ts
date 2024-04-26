import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../globals";
import { Visualiser } from "../Visualiser";

export default class waveformVisualiser extends Visualiser {

    renderVisualisation() {
        requestAnimationFrame(() => this.renderVisualisation());
        this.audioOptions.getByteDataCallback(this.audioOptions.dataArray);

        this.canvasCtx!.fillStyle = "rgb(0 0 0)";
        this.canvasCtx!.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

        this.canvasCtx!.lineWidth = 2;
        this.canvasCtx!.strokeStyle = "rgb(200 50 50)";
        this.canvasCtx?.beginPath();

        const sliceWidth = SCREEN_WIDTH / this.audioOptions.bufferLength;
        let x = 0;
        for (let i = 0; i < this.audioOptions.bufferLength; i++) {
            const v = this.audioOptions.dataArray[i] / 128.0;
            const y = v * (SCREEN_HEIGHT / 2);

            if (i == 0) this.canvasCtx?.moveTo(x, y)
            else this.canvasCtx?.lineTo(x, y)
            x += sliceWidth;
        }

        this.canvasCtx?.lineTo(SCREEN_WIDTH, SCREEN_HEIGHT / 2);
        this.canvasCtx?.stroke()
    }
}
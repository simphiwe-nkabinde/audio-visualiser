import { Visualiser } from "../Visualiser";

export class waveformVisualiser extends Visualiser {

    renderVisualisation() {
        requestAnimationFrame(() => this.renderVisualisation());
        this.getByteDataCallback(this.dataArray);

        this.canvasCtx!.fillStyle = "rgb(0 0 0)";
        this.canvasCtx!.fillRect(0, 0, this.canvasSize.width, this.canvasSize.height);

        this.canvasCtx!.lineWidth = 2;
        this.canvasCtx!.strokeStyle = "rgb(200 50 50)";
        this.canvasCtx?.beginPath();

        const sliceWidth = this.canvasSize.width / this.bufferLength;
        let x = 0;
        for (let i = 0; i < this.bufferLength; i++) {
            const v = this.dataArray[i] / 128.0;
            const y = v * (this.canvasSize.height / 2);

            if (i == 0) this.canvasCtx?.moveTo(x, y)
            else this.canvasCtx?.lineTo(x, y)
            x += sliceWidth;
        }

        this.canvasCtx?.lineTo(this.canvasSize.width, this.canvasSize.height / 2);
        this.canvasCtx?.stroke()
    }
}
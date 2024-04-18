/**
 * 
 * @param canvasCtx 
 * @param canvasWidth 
 * @param canvasHeight 
 * @param bufferLength 
 * @param dataArray 
 * @param getByteData 
 */
export default function barGraph(canvasCtx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, bufferLength: number, dataArray: Uint8Array, getByteData: Function) {
    canvasCtx?.clearRect(0, 0, canvasWidth, canvasHeight);
    function draw() {
        requestAnimationFrame(() => draw());
        getByteData(dataArray);

        canvasCtx!.fillStyle = "rgb(0 0 0)";
        canvasCtx!.fillRect(0, 0, canvasWidth, canvasHeight);

        const barWidth = (canvasWidth / bufferLength);
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            const barHeight = dataArray[i];
            canvasCtx!.fillStyle = `rgb(${barHeight + 100} 50 50)`;
            canvasCtx!.fillRect(x, canvasHeight - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }
    }
    draw()
};

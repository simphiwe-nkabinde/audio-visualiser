import Bubble from "../classes/Bubble"

export default function bubbleChaos(canvasCtx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, bufferLength: number, dataArray: Uint8Array, getByteData: Function) {

    const maxBubbleRadius = 40;
    const bubbles: Bubble[] = []
    //color palette 1 url https://coolors.co/2b2d42-8d99ae-edf2f4-ef233c-d90429
    const colorSet = {
        one: ['rgb(43, 45, 66)', 'rgb(141, 153, 174)', 'rgb(237, 242, 244)', 'rgb(239, 35, 60)', 'rgb(217, 4, 41)'],
        //color palette 2 https://coolors.co/000814-001d3d-003566-ffc300-ffd60a
        two: ['rgb(0, 8, 20)', 'rgb(0, 29, 61)', 'rgb(0, 53, 102)', 'rgb(255, 195, 0)', 'rgb(255, 214, 10)'],
        //color palette 3 https://coolors.co/fffcf2-ccc5b9-403d39-252422-eb5e28
        three: ['rgb(255, 252, 242)', 'rgb(204, 197, 185)', 'rgb(64, 61, 57)', 'rgb(37, 36, 34)', 'rgb(235, 94, 40)'],
        //color palette 4 https://coolors.co/cdb4db-ffc8dd-ffafcc-bde0fe-a2d2ff
        four: ['rgb(205, 180, 219)', 'rgb(255, 200, 221)', 'rgb(255, 175, 204)', 'rgb(189, 224, 254)', 'rgb(162, 210, 255)'],
        //color palette 5 https://coolors.co/palette/042a2b-5eb1bf-cdedf6-ef7b45-d84727
        five: ['rgb(4, 42, 43)', 'rgb(94, 177, 191)', 'rgb(205, 237, 246)', 'rgb(239, 123, 69)', 'rgb(216, 71, 39)'],
        //https://coolors.co/palette/E1E1E1-090909-1B1B1B-737373-020101
        black: ['225, 225, 225)', 'rgb(9, 9, 9)', 'rgb(27, 27, 27)', 'rgb(115, 115, 115)', 'rgb(2, 1, 1)']
    }


    for (let i = 0; i < bufferLength; i++) {
        const randomColor = colorSet.one[Math.floor(Math.random() * 5)];
        const randomStartPosition = correctStartPosition(Math.floor(Math.random() * canvasWidth), Math.floor(Math.random() * canvasHeight))
        const randomRadius = Math.floor(Math.random() * maxBubbleRadius);
        let polarityX = i % 2 == 0 ? -1 : 1
        let polarityY = i % 3 == 0 ? -1 : 1

        const randomVelocity = {
            x: polarityX * Math.ceil(Math.random() * 3),
            y: polarityY * Math.ceil(Math.random() * 3)
        }

        const bubble = new Bubble(canvasCtx, randomStartPosition, 0, randomColor, { width: canvasWidth, height: canvasHeight }, randomVelocity);

        bubbles.push(bubble);
    }
    function correctStartPosition(x: number, y: number) {
        let finalX = x;
        let finalY = y;
        if (finalX < maxBubbleRadius) finalX += maxBubbleRadius;
        if (canvasHeight - finalX < maxBubbleRadius) finalX -= maxBubbleRadius;
        if (finalY < maxBubbleRadius) finalY += maxBubbleRadius;
        if (canvasHeight - finalY < maxBubbleRadius) finalY -= maxBubbleRadius;
        return { x: finalX, y: finalY }
    }

    function draw() {
        requestAnimationFrame(draw);
        getByteData(dataArray)
        canvasCtx!.fillStyle = "rgb(255 255 255)";
        canvasCtx?.fillRect(0, 0, canvasWidth, canvasHeight);
    
        const onePart = bufferLength / 10;
    
        for (let i = 0; i < bufferLength; i++) {
          const unitAve = dataArray[i]
          if (i % 2 == 0) {
            if (i <= onePart) {
              const newRadius = (bubbles[i].getRadius() + (unitAve / 2)) / 2
              bubbles[i].update({ radius: newRadius, velocity: { x: unitAve ** (2 / unitAve), y: unitAve ** (2 / unitAve) } },);
            } else if (i >= onePart * 4 && i <= onePart * 5) {
              const newRadius = (bubbles[i].getRadius() + (unitAve / 3)) / 2
              bubbles[i].update({ radius: newRadius, velocity: { x: unitAve ** (1 / unitAve), y: unitAve ** (1 / unitAve) } },);
            } else if (i >= onePart * 7 && i <= onePart * 8) {
              const newRadius = (bubbles[i].getRadius() + (unitAve / 4)) / 2
              bubbles[i].update({ radius: newRadius, velocity: { x: 2, y: 2 } },);
            } else {
              idleBubble(bubbles[i])
            }
          }
    
        }
      }
      function idleBubble(bubble: Bubble) {
        bubble.update({ radius: 5 },)
      }
      draw()
}
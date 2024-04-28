import colorSchemes from "../../assets/colorSchemes";
import { FOCAL_LENGTH, SCREEN_HEIGHT, SCREEN_WIDTH, TRUE_ORIGIN } from "../../globals";
import { AudioOptions } from "../../interfaces/interfaces";
import Circle from "../Circle";
import { Visualiser } from "../Visualiser";

export default class Umsebenzi extends Visualiser {
    circles: Circle[];
    colorSet: number[][];
    fillColorSet: number[][] = [[255, 255, 255, 1], [0, 0, 0, 1], [252, 233, 183, 1]]
    translation = { x: 2, y: -1 };
    translationVelocity = { x: 0.001, y: -0.001 };
    timeCounter = 0;
    fillRGBA: number[];
    nextFillRGBA: number[];
    transitioningBg = false;

    constructor(canvasCtx: CanvasRenderingContext2D, audioOptions: AudioOptions) {
        super(canvasCtx, audioOptions)
        setInterval(() => this.timeCounter += 1, 1000)
        setInterval(() => this.filltransition(), 250)
        this.colorSet = colorSchemes.umsebenzi
        this.circles = [];
        this.fillRGBA = this.fillColorSet[0];
        this.nextFillRGBA = this.fillColorSet[1]

        this.createCircles()

    }
    createCircles() {
        for (let i = 0; i < this.audioOptions.bufferLength; i++) {
            const randomColor = <number[]>this.colorSet[Math.floor(Math.random() * 5)];
            let polX = !Math.floor(Math.random() * 2)
            let polY = !Math.floor(Math.random() * 2)
            let polZ = !Math.floor(Math.random() * 2)
            let polarityX = polX ? -1 : 1
            let polarityY = polY ? -1 : 1
            let polarityz = polZ ? -1 : 1
            const randomCoord = {
                x: polarityX * Math.ceil(Math.random() * TRUE_ORIGIN.x),
                y: polarityY * Math.ceil(Math.random() * TRUE_ORIGIN.y),
                z: polarityz * Math.floor(Math.random() * 200),
            }
            // const p = new Particle(this.canvasCtx, { position: randomCoord, fillRGBA: randomColor});
            const p = new Circle(this.canvasCtx, { position: randomCoord, fillRGBA: randomColor, radius: 3 });
            this.circles.push(p)
        }
    }

    renderVisualisation() {
        requestAnimationFrame(() => this.renderVisualisation())
        this.audioOptions.getByteDataCallback(this.audioOptions.dataArray)
        this.canvasCtx!.fillStyle = `rgba(${this.fillRGBA})`;
        this.canvasCtx!.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

        for (let index = 0; index < this.audioOptions.bufferLength; index++) {
            const circle = this.circles[index]
            const dataUnit = this.audioOptions.dataArray[index]

            //EFFECTS
            this.addLoom(circle, .5)
            this.spiral(circle, .25)
            if (index < 50 || index % 5 == 0) this.reactToAudio(circle, dataUnit);
            this.translateScene(circle);
            // this.addGravity(circle, index / 50)

            circle.update()
        };

        this.translation.x = this.translation.x + this.translationVelocity.x
        this.translation.y = this.translation.y + this.translationVelocity.y

        if (this.translation.x > 2 || this.translation.x < -2) this.translationVelocity.x = -1 * this.translationVelocity.x;//change polarity
        if (this.translation.y > 2 || this.translation.y < -2) this.translationVelocity.y = -1 * this.translationVelocity.y;//change polarity

        // this.filltransition()
    };
    getCoordAtCircumference(angle: number, radius: number): { x: number, y: number } {
        const angleRadians = angle * (Math.PI / 180); // Convert angle to radians
        const x = Math.cos(angleRadians) * radius;
        const y = Math.sin(angleRadians) * radius;

        return { x, y };
    }
    getAngleFromOrigin(y: number, x: number): number {
        return Math.atan2(y, x) * (180 / Math.PI); // Convert radians to degrees
    }
    getDistanceFromOrigin(x: number, y: number): number {
        return Math.sqrt(Math.pow(y, 2) + Math.pow(x, 2));
    }
    spiral(circle: Circle, incrementAngle: number) {
        const circlePosition = circle.getPosition();
        const currAngle = this.getAngleFromOrigin(circlePosition.y, circlePosition.x);
        const newXY = this.getCoordAtCircumference(currAngle + incrementAngle, this.getDistanceFromOrigin(circlePosition.x, circlePosition.y));
        circle.setPosition(newXY)
    }
    reactToAudio(circle: Circle, dataUnit: number) {
        const newRadius = (circle.getRadius() + (dataUnit / 10)) / 2;
        circle.setRadius(newRadius)
    }
    translateScene(circle: Circle) {
        let newX = circle.getPosition().x;
        let newY = circle.getPosition().y;

        newX += this.translation.x
        newY += this.translation.y
        circle.setPosition({ x: newX, y: newY })

    }
    addLoom(circle: Circle, velocity: number) {
        const posZ = circle.getPosition().z;
        circle.setPosition({ z: posZ + velocity })
        if (velocity > 0 && posZ > FOCAL_LENGTH) {
            circle.setPosition({ z: -1 * Math.ceil(Math.random() * 200) })
        } else if (velocity < 0 && posZ < -200) {
            circle.setPosition({ z: Math.ceil(Math.random() * 200) })
        }
    }
    addGravity(circle: Circle, velocity: number) {
        const posY = circle.getPosition().y
        if (posY > 600) circle.setPosition({ y: -600 })
        circle.setPosition({ y: circle.getPosition().y + velocity })
    }
    filltransition() {
        let [r, g, b, a] = this.fillRGBA; //current fill values
        let [nextR, nextG, nextB, nextA] = this.nextFillRGBA; //next fill target values

        console.log([r, g, b, a].toString() == [nextR, nextG, nextB, nextA].toString());


        //increment / decrement toward the nextFill
        const incrementvalue = 1
        if (r < nextR) r += incrementvalue
        else if (r > nextR) r -= incrementvalue
        if (g < nextG) g += incrementvalue
        else if (g > nextG) g -= incrementvalue
        if (b < nextB) b += incrementvalue
        else if (b > nextB) b -= incrementvalue
        if (a < nextA) a += incrementvalue
        else if (a > nextA) a -= incrementvalue

        this.fillRGBA = [r, g, b, a]

        //current fill == next fill target
        if (r == nextR && g == nextG && b == nextB && a == nextA) {
            console.log('match');

            const index = this.fillColorSet.findIndex(i => i.toString() == this.fillRGBA.toString()); // index of fill in the fillColorSet
            this.nextFillRGBA = (index == this.fillColorSet.length - 1) ? this.fillColorSet[0] : this.fillColorSet[index + 1]
        }
    }
}
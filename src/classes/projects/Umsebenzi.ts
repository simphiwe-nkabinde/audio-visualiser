import colorSchemes from "../../assets/colorSchemes";
import { FOCAL_LENGTH, SCREEN_HEIGHT, SCREEN_WIDTH, TRUE_ORIGIN } from "../../globals";
import { AudioOptions } from "../../interfaces/interfaces";
import Circle from "../Circle";
import { Visualiser } from "../Visualiser";

export default class Umsebenzi extends Visualiser{
    circles: Circle[];
    colorSet: any;
    translation = { x: 2, y: -1 };
    translationVelocity = { x: 0.001, y: -0.001 };
    timeCounter = 0;
    fillRGBA: number[] = [0, 0, 0, 1];
    transitioningBg = false;

    constructor(canvasCtx: CanvasRenderingContext2D, audioOptions: AudioOptions) {
        super(canvasCtx, audioOptions)
        setInterval(() => this.timeCounter += 1, 1000)
        this.colorSet = colorSchemes.umsebenzi
        this.circles = [];

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
                x: polarityX * Math.ceil(Math.random() * TRUE_ORIGIN.x / 2),
                y: polarityY * Math.ceil(Math.random() * TRUE_ORIGIN.y / 2),
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
            const circlePosition = circle.getPosition();
            circle.setPosition({ z: circlePosition.z + 2 })
            if (circlePosition.z > FOCAL_LENGTH) {
                circle.setPosition({ z: -1 * Math.ceil(Math.random() * 200) })
            }

            this.spiral(circle)
            const dataUnit = this.audioOptions.dataArray[index]
            this.reactToAudio(circle, dataUnit, index);
            this.translateScene(circle);
            if (index == 5 && (this.timeCounter && this.timeCounter % 30 == 0)) this.addBgTransition(circle)
            circle.update()
        };
        this.translation.x = this.translation.x + this.translationVelocity.x
        this.translation.y = this.translation.y + this.translationVelocity.y

        if (this.translation.x > 2 || this.translation.x < -2) this.translationVelocity.x = -1 * this.translationVelocity.x;//change polarity
        if (this.translation.y > 2 || this.translation.y < -2) this.translationVelocity.y = -1 * this.translationVelocity.y;//change polarity

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
    spiral(circle: Circle) {
        const circlePosition = circle.getPosition();
        const currAngle = this.getAngleFromOrigin(circlePosition.y, circlePosition.x);
        const newXY = this.getCoordAtCircumference(currAngle + .5, this.getDistanceFromOrigin(circlePosition.x, circlePosition.y));
        circle.setPosition(newXY)
    }
    reactToAudio(circle: Circle, dataUnit: number, index: number) {
        const onePart = this.audioOptions.bufferLength / 10;
        const newRadius = (circle.getRadius() + (dataUnit / 20)) / 2;
        if (index % 5 !== 0)
            circle.setRadius(newRadius)
    }
    translateScene(circle: Circle) {
        let newX = circle.getPosition().x;
        let newY = circle.getPosition().y;

        newX += this.translation.x
        newY += this.translation.y
        circle.setPosition({ x: newX, y: newY })

    }
    addBgTransition(circle: Circle) {
        if (circle.getPosition().z < -100 || this.transitioningBg) {
            this.transitioningBg = true
            if (circle.getRadius() > 500) {
                this.fillRGBA = circle.getFillRGBA();
                circle.setFillRGBA(this.colorSet[Math.floor(Math.random() * 5)])
                circle.setRadius(1)
                this.transitioningBg = false
            }
            else circle.setRadius(circle.getRadius() * 1.1)
        }
    }
}
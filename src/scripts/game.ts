import { Field } from "./field.js"
import { Point } from "./utils/point.js"
import { Cell } from "./cell.js"
import { chicken, lion, elephant, giraffe, Figure, } from "./figures.js"

class Game {

    private static readonly CANVAS_ID = "canvas"

    private canvas: HTMLCanvasElement

    private readonly imageList: HTMLImageElement[] = []

    private readonly images: { [key: string]: HTMLImageElement } = {}

    private readonly field: Field

    private sideLen = 100

    constructor(field: Field) {
        this.loadImages()
        this.initCanvas()

        this.field = field
    }

    private loadImages() {
        function generateImagePath(imageShortName: string): string {
            return "assets/" + imageShortName + ".png";
        }

        const figuresTypes = [
            chicken,
            lion,
            elephant,
            giraffe
        ]

        figuresTypes.forEach(type => {
            const assetName = generateImagePath(type.assetName)

            const img = new Image()
            img.src = assetName

            this.images[type.assetName] = img
            this.imageList.push(img)
        })
    }

    private initCanvas() {
        this.canvas = document.getElementById(Game.CANVAS_ID) as HTMLCanvasElement

        this.canvas.width = globalThis.innerWidth
        this.canvas.height = globalThis.innerHeight

        this.canvas.onmousedown = (event) => {
            console.log(event.offsetX)
            console.log(event.offsetY)
        }
    }

    private drawCell(ctx: CanvasRenderingContext2D, cell: Cell, coords: Point) {
        if (cell.containsFigure) {
            this.drawFigure(ctx, cell.figure, coords)
        }
    }

    private drawFigure(ctx: CanvasRenderingContext2D, figure: Figure, coords: Point) {
        ctx.drawImage(this.images[figure.type.assetName], coords.x*this.sideLen, coords.y*this.sideLen, this.sideLen, this.sideLen)
    }

    async draw() {
        const ctx = this.canvas.getContext("2d");

        ctx.fillStyle = "green";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        //check document.images
        await Promise.all(
            this.imageList.map(
                (image) =>
                    new Promise((resolve) => image.addEventListener("load", resolve)),
            ),
        );


        for (let i = 0; i < this.field.nRows; i++) {
            for (let j = 0; j < this.field.nCols; j++) {
                const cell = this.field.cells[i][j]
                this.drawCell(ctx, cell, new Point(j, i))
            }
        }


        //const chickenFigure = new Figure(Direction.UP, chicken)
        //const lionFigure = new Figure(Direction.UP, lion)

        //this.drawFigure(ctx, chickenFigure, new Point(0, 0))
        //this.drawFigure(ctx, lionFigure, new Point(1, 1))
    }

}

export { Game }


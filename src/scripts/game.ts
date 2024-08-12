import { Field } from "./field.js"
import { Point } from "./utils/point.js"
import { Cell } from "./cell.js"
import { chicken, lion, elephant, giraffe, Figure, Direction, } from "./figures.js"

class Game {

    private static readonly CELLS_HEIGHT_TO_SCREEN = 0.7

    private static readonly CANVAS_ID = "canvas"

    private canvas: HTMLCanvasElement

    private readonly imageList: HTMLImageElement[] = []

    private readonly images: { [key: string]: HTMLImageElement } = {}

    private readonly field: Field

    private cellSideSize: number

    private cellsTopLeft: Point

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

    private getFigureScreenCoords(fieldCoords: Point) {
        const res = new Point(
            fieldCoords.x*this.cellSideSize,
            (this.field.nRows - (fieldCoords.y + 1))*this.cellSideSize
        )

        res.add(this.cellsTopLeft)

        return res
    }

    private drawFigure(ctx: CanvasRenderingContext2D, figure: Figure, coords: Point) {
        const image = this.images[figure.type.assetName]

        const figureScreenCoords = this.getFigureScreenCoords(coords)

        if (figure.direction == Direction.DOWN) {
            ctx.save()

            ctx.rotate(Math.PI)

            ctx.drawImage(image,
                          -figureScreenCoords.x - this.cellSideSize,
                          -figureScreenCoords.y - this.cellSideSize,
                          this.cellSideSize,
                          this.cellSideSize)

            ctx.restore()
        } else {
            ctx.drawImage(image,
                          figureScreenCoords.x,
                          figureScreenCoords.y,
                          this.cellSideSize,
                          this.cellSideSize
                         )
        }
    }

    async draw() {
        const ctx = this.canvas.getContext("2d");

        ctx.fillStyle = "green";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.cellSideSize = (this.canvas.height*Game.CELLS_HEIGHT_TO_SCREEN)/this.field.nRows
        this.cellsTopLeft = new Point(
            (this.canvas.width - (this.field.nCols*this.cellSideSize))/2,
            (this.canvas.height - (this.field.nRows*this.cellSideSize))/2
        )
        
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
    }

}

export { Game }


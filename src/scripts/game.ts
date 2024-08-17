import { Field } from "./field.js"
import { Point } from "./utils/point.js"
import { Cell } from "./cell.js"
import { chicken, lion, elephant, giraffe, Figure, Direction, FigureType, } from "./figures.js"

class Game {

    private static readonly CELLS_HEIGHT_TO_SCREEN = 0.5

    private static readonly FIGURE_TO_CELL= 0.93

    private static readonly EATEN_FIGURES_HEIGHT_TO_FREE = 0.5

    private static readonly EATEN_FIGURES_MARGIN_PERCENT = 0.04

    private static readonly CANVAS_ID = "canvas"

    private canvas = document.getElementById(Game.CANVAS_ID) as HTMLCanvasElement

    private readonly imageList: HTMLImageElement[] = []

    private readonly images: { [key: string]: HTMLImageElement } = {}

    private readonly field: Field

    private cellSideSize: number = 0

    private figureSideSize: number = 0

    private deltaFigureCell: number = 0

    private cellsTopLeft = new Point(0, 0)

    constructor(field: Field) {
        this.loadImages()
        this.initCanvas()

        this.field = field
    }

    private loadImages() {
        function generateImagePath(imageShortName: string): string {
            return "assets/" + imageShortName + ".png"
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

    getClickedCellCoords(canvasClickPoint: Point): Point | null {
        const cellsBottomRight = new Point(this.field.nCols*this.cellSideSize, this.field.nRows*this.cellSideSize)
        cellsBottomRight.add(this.cellsTopLeft)

        if (!canvasClickPoint.inRect(this.cellsTopLeft, cellsBottomRight)) {
            return null
        }

        return new Point(
             Math.floor((canvasClickPoint.x - this.cellsTopLeft.x)/this.cellSideSize),
             this.field.nRows - Math.floor((canvasClickPoint.y - this.cellsTopLeft.y)/this.cellSideSize) - 1
        )
    }

    private initCanvas() {
        this.canvas = document.getElementById(Game.CANVAS_ID) as HTMLCanvasElement

        this.canvas.width = globalThis.innerWidth
        this.canvas.height = globalThis.innerHeight

        this.canvas.onmousedown = async (event) => {
            const canvasClickPoint = new Point(event.offsetX, event.offsetY)

            const clickedCellCoords = this.getClickedCellCoords(canvasClickPoint)
            
            if (clickedCellCoords == null) {
                return
            }
            
            this.field.update(clickedCellCoords)

            await this.drawInner()
        }
    }

    private drawCell(ctx: CanvasRenderingContext2D, cell: Cell, coords: Point) {
        if (cell.isHighlighted) {
            ctx.fillStyle = "red"
            ctx.fillRect(
                this.cellsTopLeft.x + coords.x*this.cellSideSize,
                this.cellsTopLeft.y + (this.field.nRows - coords.y - 1)*this.cellSideSize,
                this.cellSideSize,
                this.cellSideSize
            )
        }

        if (cell.figure) {
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
                          -(figureScreenCoords.x + this.cellSideSize - this.deltaFigureCell),
                          -(figureScreenCoords.y + this.cellSideSize - this.deltaFigureCell),
                          this.figureSideSize,
                          this.figureSideSize)

            ctx.restore()
        } else {
            ctx.drawImage(image,
                          figureScreenCoords.x + this.deltaFigureCell,
                          figureScreenCoords.y + this.deltaFigureCell,
                          this.figureSideSize,
                          this.figureSideSize
                         )
        }
    }

    private drawEatenFigures(topLeft: Point, eatenFigureFullSize: number, eatenFigureMarging: number, bag: FigureType[]) {
        const eatenFigureSize = eatenFigureFullSize - 2*eatenFigureMarging

        const ctx = this.canvas.getContext("2d")!

        let pos = Point.from(topLeft)

        for (const figureType of bag) {
            const image = this.images[figureType.assetName]

            ctx.drawImage(image,
                          pos.x + eatenFigureMarging,
                          pos.y + eatenFigureMarging,
                          eatenFigureSize,
                          eatenFigureSize
                         )

            pos.x += eatenFigureSize
        }
    }

    async draw() {
        const ctx = this.canvas.getContext("2d")!

        ctx.fillStyle = "green"
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        this.cellSideSize = (this.canvas.height*Game.CELLS_HEIGHT_TO_SCREEN)/this.field.nRows
        this.figureSideSize = this.cellSideSize*Game.FIGURE_TO_CELL
        this.deltaFigureCell = (this.cellSideSize - this.figureSideSize)/2

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
        )

        for (let i = 0; i < this.field.nRows; i++) {
            for (let j = 0; j < this.field.nCols; j++) {
                const cell = this.field.cells[i][j]
                this.drawCell(ctx, cell, new Point(j, i))
            }
        }
    }

    private async drawInner() {
        const ctx = this.canvas.getContext("2d")!

        ctx.fillStyle = "green"
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        this.cellSideSize = (this.canvas.height*Game.CELLS_HEIGHT_TO_SCREEN)/this.field.nRows
        this.figureSideSize = this.cellSideSize*Game.FIGURE_TO_CELL
        this.deltaFigureCell = (this.cellSideSize - this.figureSideSize)/2

        this.cellsTopLeft = new Point(
            (this.canvas.width - (this.field.nCols*this.cellSideSize))/2,
            (this.canvas.height - (this.field.nRows*this.cellSideSize))/2
        )
        
        const eatenFigureFullSize = this.cellsTopLeft.y*Game.EATEN_FIGURES_HEIGHT_TO_FREE

        const eatenFigureMargin = eatenFigureFullSize*Game.EATEN_FIGURES_MARGIN_PERCENT

        const topEatenFigures = Array.from(this.field.topEatenFigures.keys())
        const bottomEatenFigures = Array.from(this.field.bottomEatenFigures.keys())

        const topEatenFiguresTopLeft = new Point(
            (this.canvas.width - topEatenFigures.length*eatenFigureFullSize)/2,
            (this.cellsTopLeft.y - eatenFigureFullSize)/2
        )

        const bottomEatenFiguresTopLeft = new Point(
            (this.canvas.width - bottomEatenFigures.length*eatenFigureFullSize)/2,
            topEatenFiguresTopLeft.y + this.cellsTopLeft.y + this.cellSideSize*this.field.nRows
        )

        this.drawEatenFigures(topEatenFiguresTopLeft, eatenFigureFullSize, eatenFigureMargin, topEatenFigures)
        this.drawEatenFigures(bottomEatenFiguresTopLeft, eatenFigureFullSize, eatenFigureMargin, bottomEatenFigures)

        for (let i = 0; i < this.field.nRows; i++) {
            for (let j = 0; j < this.field.nCols; j++) {
                const cell = this.field.cells[i][j]
                this.drawCell(ctx, cell, new Point(j, i))
            }
        }
    }
}

export { Game }


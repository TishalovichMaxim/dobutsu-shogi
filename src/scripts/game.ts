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

    private topEatenFigures: FigureType[] = []

    private bottomEatenFigures: FigureType[] = []

    private topEatenFiguresTopLeft = new Point(0, 0)

    private bottomEatenFiguresTopLeft = new Point(0, 0)

    private eatenFigureFullSize = 0

    constructor(field: Field) {
        this.genImageList()
        this.initCanvas()

        this.field = field
    }

    private genImageList() {
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

    private getClickedCellCoords(canvasClickPoint: Point): Point | null {
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

    private getClickedTopBagFigure(clickCoords: Point): FigureType | null {
        for (let i = 0; i < this.topEatenFigures.length; i++) {
            const topLeft = new Point(
                this.topEatenFiguresTopLeft.x + i*this.eatenFigureFullSize,
                this.topEatenFiguresTopLeft.y
            )
            const bottomRight = new Point(
                topLeft.x + this.eatenFigureFullSize,
                topLeft.y + this.eatenFigureFullSize,
            )
            if (clickCoords.inRect(topLeft, bottomRight)) {
                return this.topEatenFigures[i]
            }
        }
        
        return null
    }

    private getClickedBottomBagFigure(clickCoords: Point): FigureType | null {
        for (let i = 0; i < this.bottomEatenFigures.length; i++) {
            const topLeft = new Point(
                this.bottomEatenFiguresTopLeft.x + i*this.eatenFigureFullSize,
                this.bottomEatenFiguresTopLeft.y
            )
            const bottomRight = new Point(
                topLeft.x + this.eatenFigureFullSize,
                topLeft.y + this.eatenFigureFullSize,
            )
            if (clickCoords.inRect(topLeft, bottomRight)) {
                return this.bottomEatenFigures[i]
            }
        }
        
        return null
    }

    private initCanvas() {
        this.canvas = document.getElementById(Game.CANVAS_ID) as HTMLCanvasElement

        this.canvas.width = globalThis.innerWidth
        this.canvas.height = globalThis.innerHeight

        this.canvas.onmousedown = async (event) => {
            const canvasClickPoint = new Point(event.offsetX, event.offsetY)

            const clickedCellCoords = this.getClickedCellCoords(canvasClickPoint)
            
            if (clickedCellCoords == null) {
                const topBagChosenFigureType = this.getClickedTopBagFigure(canvasClickPoint)
                if (topBagChosenFigureType) {
                    this.field.chooseTopBagFigure(topBagChosenFigureType)
                    this.draw()
                    return
                }

                const bottomBagChosenFigureType = this.getClickedBottomBagFigure(canvasClickPoint)
                if (bottomBagChosenFigureType) {
                    this.field.chooseBottomBagFigure(bottomBagChosenFigureType)
                    this.draw()
                    return
                }

                return
            }
            
            this.field.update(clickedCellCoords)

            this.draw()
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

    private drawEatenFigures(topLeft: Point, eatenFigureFullSize: number, eatenFigureMarging: number, bag: FigureType[], dir: Direction) {
        const eatenFigureSize = eatenFigureFullSize - 2*eatenFigureMarging

        const ctx = this.canvas.getContext("2d")!

        let pos = Point.from(topLeft)

        ctx.fillStyle = "red"

        for (const figureType of bag) {
            const image = this.images[figureType.assetName]

            if (dir == this.field.turnDirection && figureType == this.field.chosenFigureType) {
                ctx.fillRect(
                    pos.x,
                    pos.y,
                    eatenFigureFullSize,
                    eatenFigureFullSize
                )
            }

            ctx.drawImage(image,
                          pos.x + eatenFigureMarging,
                          pos.y + eatenFigureMarging,
                          eatenFigureSize,
                          eatenFigureSize
                         )

            pos.x += eatenFigureFullSize
        }
    }

    async loadImages() {
        await Promise.all(
            this.imageList.map(
                (image) =>
                    new Promise((resolve) => image.addEventListener("load", resolve)),
            ),
        )
    }

    draw() {
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
        
        this.eatenFigureFullSize = this.cellsTopLeft.y*Game.EATEN_FIGURES_HEIGHT_TO_FREE

        const eatenFigureMargin = this.eatenFigureFullSize*Game.EATEN_FIGURES_MARGIN_PERCENT

        this.topEatenFigures = Array.from(this.field.topEatenFigures.keys())
        this.bottomEatenFigures = Array.from(this.field.bottomEatenFigures.keys())

        this.topEatenFiguresTopLeft = new Point(
            (this.canvas.width - this.topEatenFigures.length*this.eatenFigureFullSize)/2,
            (this.cellsTopLeft.y - this.eatenFigureFullSize)/2
        )

        this.bottomEatenFiguresTopLeft = new Point(
            (this.canvas.width - this.bottomEatenFigures.length*this.eatenFigureFullSize)/2,
            this.topEatenFiguresTopLeft.y + this.cellsTopLeft.y + this.cellSideSize*this.field.nRows
        )

        this.drawEatenFigures(this.topEatenFiguresTopLeft, this.eatenFigureFullSize, eatenFigureMargin, this.topEatenFigures, Direction.DOWN)
        this.drawEatenFigures(this.bottomEatenFiguresTopLeft, this.eatenFigureFullSize, eatenFigureMargin, this.bottomEatenFigures, Direction.UP)

        ctx.fillStyle = "blue"
        ctx.fillRect(
            this.cellsTopLeft.x,
            this.cellsTopLeft.y,
            this.field.nCols*this.cellSideSize,
            this.field.nRows*this.cellSideSize
        )

        for (let i = 0; i < this.field.nRows; i++) {
            for (let j = 0; j < this.field.nCols; j++) {
                const cell = this.field.cells[i][j]
                this.drawCell(ctx, cell, new Point(j, i))
            }
        }

        ctx.fillStyle = "black"
        ctx.lineWidth = 2

        for (let i = 0; i < this.field.nRows + 1; i++) {
            ctx.moveTo(this.cellsTopLeft.x, this.cellsTopLeft.y + i*this.cellSideSize)
            ctx.lineTo(
                this.cellsTopLeft.x + this.field.nCols*this.cellSideSize,
                this.cellsTopLeft.y + i*this.cellSideSize
            )
        }

        for (let i = 0; i < this.field.nCols + 1; i++) {
            ctx.moveTo(this.cellsTopLeft.x + i*this.cellSideSize, this.cellsTopLeft.y)
            ctx.lineTo(
                this.cellsTopLeft.x + i*this.cellSideSize,
                this.cellsTopLeft.y + this.field.nRows*this.cellSideSize
            )
        }

        ctx.stroke()
    }
}

export { Game }


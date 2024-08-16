import { Direction, Figure, FigureType } from "./figures.js"
import { Cell } from "./cell.js"
import { Point } from "./utils/point.js"
import { Player } from "./player.js"

class Field {

    private _topPlayer = new Player(Direction.DOWN)

    private _bottomPlayer = new Player(Direction.UP)

    get topEatenFigures(): Map<FigureType, number> {
        return this._topPlayer.bag
    }

    get bottomEatenFigures(): Map<FigureType, number> {
        return this._bottomPlayer.bag
    }

    get nRows() {
        return this.cells.length
    }

    get nCols() {
        return this.cells[0].length
    }

    cells: Cell[][] = []

    private _turnPlayer = this._bottomPlayer

    private changeTurn() {
        if (this._turnPlayer == this._bottomPlayer) {
            this._turnPlayer = this._topPlayer
        } else {
            this._turnPlayer = this._bottomPlayer
        }
    }

    private _chosenFigureCoords: Point | null = null

    private _chosenFigureAfterMoveCoords: Point[] | null = null

    private unchooseFigure() {
        if (!this._chosenFigureCoords) {
            return
        }

        for (const highlightedCellCoords of this._chosenFigureAfterMoveCoords!) {
            this.cell(highlightedCellCoords).unhighlight()
        }

        this._chosenFigureCoords = null
        this._chosenFigureAfterMoveCoords = null
    }

    private chooseFigure(coords: Point) {
        this.unchooseFigure()
        const cell = this.cell(coords)

        if (!cell.figure) {
            return
        }

        const figure: Figure = cell.figure

        if (this._turnPlayer.figuresDirection != figure.direction) {
            return
        }

        this._chosenFigureCoords = coords
        this._chosenFigureAfterMoveCoords = this.highlightPossibleMoves(coords)
    }

    constructor(figures: (Figure | null)[][]) {
        for (let i = 0; i < figures.length; i++) {
            this.cells[i] = []
            for (let j = 0; j < figures[i].length; j++) {
                this.cells[i][j] = new Cell()
                if (figures[i][j]) {
                    this.cells[i][j].figure = figures[i][j]
                }
            }
        }
    }

    unhilightAllCells() {
        for (let i = 0; i < this.nRows; i++) {
            for (let j = 0; j < this.nCols; j++) {
                this.cells[i][j].unhighlight()
            }
        }
    }

    cell(coords: Point): Cell {
        return this.cells[coords.y][coords.x]
    }

    move(to: Point): boolean {
        function possibleMove(afterMoveCoords: Point, afterMovePossibleCoords: Point[]): boolean {
            for (const possibleCoords of afterMovePossibleCoords) {
                if (afterMoveCoords.equal(possibleCoords)) {
                    return true
                }
            }

            return false
        }

        if (!possibleMove(to, this._chosenFigureAfterMoveCoords!)) {
            return false
        }

        const fromCell = this.cell(this._chosenFigureCoords!)
        const toCell = this.cell(to)

        const movedFigure = fromCell.figure

        fromCell.figure = null

        const eatenFigure = toCell.figure
        if (eatenFigure) {
            this._turnPlayer.addEatenFigure(eatenFigure.type)
        }

        toCell.figure = movedFigure

        this.unhilightAllCells()
        this.unchooseFigure()

        this.changeTurn()

        return true
    }

    private validateHihglightedCell(figureDir: Direction,coords: Point): boolean {
        if (
            coords.x >= 0
            && coords.x < this.nCols
            && coords.y >= 0
            && coords.y < this.nRows
        ) {
            const cell = this.cell(coords)
            return !cell.figure || cell.figure.direction != figureDir
        }

        return false
    }

    highlightPossibleMoves(coords: Point): Point[] {
        const possibleMoves: Point[] = []

        this.unhilightAllCells()

        const figure = this.cell(coords).figure!

        function calCoordsAfterMoveUp(coords: Point, move: Point): Point {
            return new Point(coords.x + move.x, coords.y + move.y)
        }

        function calCoordsAfterMoveDown(coords: Point, move: Point): Point {
            return new Point(coords.x - move.x, coords.y - move.y)
        }

        let calcCoordsAfterMove = calCoordsAfterMoveUp
        if (figure.direction == Direction.DOWN) {
            calcCoordsAfterMove = calCoordsAfterMoveDown
        }

        for (const move of figure.type.moves) {
            const highlightedCellCoords = calcCoordsAfterMove(coords, move)

            if (this.validateHihglightedCell(figure.direction, highlightedCellCoords)) {
                const cell = this.cell(highlightedCellCoords)
                cell.highlight()
                possibleMoves.push(highlightedCellCoords)
            }
        }

        return possibleMoves
    }

    update(coords: Point) {
        if (!this._chosenFigureCoords) {
            this.chooseFigure(coords)
            return
        }

        if (this.move(coords)) {
            return
        }

        this.chooseFigure(coords)
    }

}

export { Field }


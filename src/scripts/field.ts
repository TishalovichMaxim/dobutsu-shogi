import { Direction, Figure } from "./figures.js"
import { Cell } from "./cell.js"
import { Point } from "./utils/point.js"

class Field {

    get nRows() {
        return this.cells.length
    }

    get nCols() {
        return this.cells[0].length
    }

    public cells: Cell[][] = []

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

    public unhilightAllCells() {
        for (let i = 0; i < this.nRows; i++) {
            for (let j = 0; j < this.nCols; j++) {
                this.cells[i][j].unhighlight()
            }
        }
    }

    cell(coords: Point): Cell {
        return this.cells[coords.y][coords.x]
    }

    move(from: Point, to: Point): null | Figure {
        const fromCell = this.cell(from)
        const toCell = this.cell(to)

        const movedFigure = fromCell.figure

        fromCell.figure = null

        const eatenFigure = toCell.figure

        toCell.figure = movedFigure

        this.unhilightAllCells()

        return eatenFigure
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
        if (figure.direction == Direction.UP) {
            for (const move of figure.type.moves) {
                const highlightedCellCoords = new Point(
                    coords.x + move.x,
                    coords.y + move.y
                )

                if (this.validateHihglightedCell(figure.direction, highlightedCellCoords)) {
                    const cell = this.cell(highlightedCellCoords)
                    cell.highlight()
                    possibleMoves.push(highlightedCellCoords)
                    
                }
            }
        } else {
            for (const move of figure.type.moves) {
                const highlightedCellCoords = new Point(
                    coords.x - move.x,
                    coords.y - move.y
                )

                if (this.validateHihglightedCell(figure.direction, highlightedCellCoords)) {
                    const cell = this.cell(highlightedCellCoords)
                    cell.highlight()
                    possibleMoves.push(highlightedCellCoords)
                    
                }
            }
        }

        return possibleMoves
    }

}

export { Field }


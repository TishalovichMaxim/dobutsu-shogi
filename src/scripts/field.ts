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

    private unhilightAllCells() {
        for (let i = 0; i < this.nRows; i++) {
            for (let j = 0; j < this.nCols; j++) {
                this.cells[i][j].unhighlight()
            }
        }
    }

    cell(coords: Point): Cell {
        return this.cells[coords.y][coords.x]
    }

    move(from: Point, to: Point) {
        const fromCell = this.cell(from)
        const toCell = this.cell(to)


        const movedFigure = fromCell.figure

        fromCell.figure = null
        toCell.figure = movedFigure

        this.unhilightAllCells()
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

                if (
                    highlightedCellCoords.x >= 0
                    && highlightedCellCoords.x < this.nCols
                    && highlightedCellCoords.y >= 0
                    && highlightedCellCoords.y < this.nRows
                ) {
                    const cell = this.cell(highlightedCellCoords)
                    cell.highlight()
                    possibleMoves.push(highlightedCellCoords)
                    
                }
            }
        } else {
            
        }

        return possibleMoves
    }

}

export { Field }


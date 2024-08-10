import { Direction, FigureType, Figure } from "./figures.js"
import { Point } from "./utils/point.js"
import { Cell } from "./cell.js"

class Field {

    readonly nRows: number

    readonly nCols: number

    public cells: Cell[][] = []

    constructor() {
    }

}

export { Field }


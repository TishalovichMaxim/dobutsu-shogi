import { Direction, FigureType, Figure } from "./figures.js"
import { Cell } from "./cell.js"

class Player {

    bag: Figure[] = []

}

class Field {

    readonly bottomPlayer: Player = new Player()

    readonly topPlayer: Player = new Player()

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
    
}

export { Field }


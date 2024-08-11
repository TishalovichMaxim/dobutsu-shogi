import { Figure } from "./figures.js"

class Cell {

    private _isHighlighted: boolean = false

    public figure: Figure | null = null

    get isHighlighted(): boolean {
        return this._isHighlighted
    }

    get containsFigure(): boolean {
        return this.figure != null
    }

    removeFigure() {
        this.figure = null
    }

    highlight() {
        this._isHighlighted = true
    }

}

export { Cell }


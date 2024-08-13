import { Figure } from "./figures.js"

class Cell {

    private _isHighlighted: boolean = false

    public figure: Figure | null = null

    get isHighlighted() {
        return this._isHighlighted;
    }

    get containsFigure(): boolean {
        return this.figure != null
    }

    removeFigure() {
        this.figure = null
    }

    unhighlight() {
        this._isHighlighted = false
    }

    highlight() {
        this._isHighlighted = true
    }

}

export { Cell }


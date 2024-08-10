import { Figure } from "./figures.js"

class Cell {
    
    private _isHighlighted: boolean = false

    private _figure: Figure | null

    get figure(): Figure {
        return this._figure
    }

    get isHighlighted(): boolean {
        return this._isHighlighted
    }

    get containsFigure(): boolean {
        return this.figure != null
    }

    removeFigure() {
        this._figure = null
    }

    highlight() {
        this._isHighlighted = true
    }

}

export { Cell }


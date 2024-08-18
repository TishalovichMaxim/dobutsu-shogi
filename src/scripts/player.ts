import { Direction } from "./figures";
import { FigureType } from "./figures";

class Player {

    bag: Map<FigureType, number> = new Map<FigureType, number>()

    constructor(
        public readonly figuresDirection: Direction
    ) {
    }

    addEatenFigure(figureType: FigureType) {
        const prevValue = this.bag.get(figureType) 
        if (prevValue) {
            this.bag.set(figureType, prevValue + 1)
        } else {
            this.bag.set(figureType, 1)
        }
    }

    removeEatenFigure(figureType: FigureType) {
        const prevValue = this.bag.get(figureType)
        if (prevValue == 1) {
            this.bag.delete(figureType)
        }
    }

}

export { Player }


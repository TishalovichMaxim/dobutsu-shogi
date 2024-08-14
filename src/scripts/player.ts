import { Direction, Figure } from "./figures";

class Player {

    bag: Figure[] = []

    constructor(
        public readonly figuresDirection: Direction
    ) {
    }

}

export { Player }


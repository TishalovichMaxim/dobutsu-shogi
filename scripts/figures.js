import { Point } from "./utils/point.js"

function createFigureType(assetName, moves) {
    return {
	moves: moves,
	assetName: assetName
    }
}

class Direction {

    static UP = 0

    static DOWN = 1

}

class Figure {

    constructor(direction, type) {
	this.type = type
	this.direction = direction
    }

}

const chicken = createFigureType(
    "chicken",
    [
	new Point(0, 1),
    ],
)

const lion = createFigureType(
    "lion",
    [
	new Point(0, 1),
	new Point(1, 1),
	new Point(1, 0),
	new Point(1, -1),
	new Point(-1, -1),
	new Point(-1, 0),
	new Point(-1, 1),
    ],
)

const giraffe = createFigureType(
    "giraffe",
    [
	new Point(0, 1),
	new Point(1, 0),
	new Point(0, -1),
	new Point(-1, 0),
    ],
)

const elephant = createFigureType(
    "elephant",
    [
	new Point( 1,  1),
	new Point( 1, -1),
	new Point(-1, -1),
	new Point(-1,  1),
    ],
)

export { Figure, Direction, chicken, lion, giraffe, elephant }


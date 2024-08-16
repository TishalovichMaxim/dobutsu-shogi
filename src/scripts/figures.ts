import { Point } from "./utils/point.js"

class FigureType {

    constructor(public assetName: string, public moves: Point[]) {
    }

}

enum Direction {

    UP,
    DOWN,

}

class Figure {

    constructor(public direction: Direction, public type: FigureType) {
    }

}

const chicken = new FigureType(
    "chicken",
    [
	new Point(0, 1),
    ],
)

const lion = new FigureType(
    "lion",
    [
	new Point(0, 1),
	new Point(1, 1),
	new Point(1, 0),
	new Point(1, -1),
	new Point(0, -1),
	new Point(-1, -1),
	new Point(-1, 0),
	new Point(-1, 1),
    ],
)

const giraffe = new FigureType(
    "giraffe",
    [
	new Point(0, 1),
	new Point(1, 0),
	new Point(0, -1),
	new Point(-1, 0),
    ],
)

const elephant = new FigureType(
    "elephant",
    [
	new Point( 1,  1),
	new Point( 1, -1),
	new Point(-1, -1),
	new Point(-1,  1),
    ],
)

export { Figure, FigureType, Direction, chicken, lion, giraffe, elephant }


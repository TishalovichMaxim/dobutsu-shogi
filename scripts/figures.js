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

const chicken = createFigureType(
    [
	new Point(0, 1),
    ],
    "chicken"
)

const lion = createFigureType(
    [
	new Point(0, 1),
	new Point(1, 1),
	new Point(1, 0),
	new Point(1, -1),
	new Point(-1, -1),
	new Point(-1, 0),
	new Point(-1, 1),
    ],
    "lion"
)

const giraffe = createFigureType(
    [
	new Point(0, 1),
	new Point(1, 0),
	new Point(0, -1),
	new Point(-1, 0),
    ],
    "giraffe"
)

const elephant = createFigureType(
    [
	new Point( 1,  1),
	new Point( 1, -1),
	new Point(-1, -1),
	new Point(-1,  1),
    ],
    "elephant"
)

export { Direction, chicken, lion, giraffe, elephant }


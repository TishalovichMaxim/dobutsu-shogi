import { Field } from "./field.js"
import { Point } from "./utils/point.js"
import { chicken, lion, elephant, giraffe, Direction, Figure } from "./figures.js"

const figures = [
    new Figure(Direction.UP, 	chicken, 	new Point(1, 1)),
    new Figure(Direction.DOWN, 	elephant,	new Point(2, 1)),
    new Figure(Direction.UP, 	lion,		new Point(1, 2)),
    new Figure(Direction.DOWN, 	giraffe,	new Point(2, 2))
] 

const field = new Field()

field.draw(figures)


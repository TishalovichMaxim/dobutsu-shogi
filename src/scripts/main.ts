import { Game } from "./game.js"
import { Field } from "./field.js"
import { chicken, lion, elephant, giraffe, Direction, Figure } from "./figures.js"

const figures4x3 = [
    [
        new Figure(Direction.UP, elephant),
        new Figure(Direction.UP, lion),
        new Figure(Direction.UP, giraffe),
    ],
    [
        null,
        new Figure(Direction.UP, chicken),
        null,
    ],
    [
        null,
        new Figure(Direction.DOWN, chicken),
        null,
    ],
    [
        new Figure(Direction.DOWN, giraffe),
        new Figure(Direction.DOWN, lion),
        new Figure(Direction.DOWN, elephant),
    ],
] 

const field4x3 = new Field(figures4x3)

const game = new Game(field4x3)

game.draw()


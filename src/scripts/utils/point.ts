class Point {

    constructor(public x: number, public y: number) {
    }

    add(p: Point) {
        this.x += p.x
        this.y += p.y
    }

}

export { Point }


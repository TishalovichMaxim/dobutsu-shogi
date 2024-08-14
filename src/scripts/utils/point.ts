class Point {

    constructor(public x: number, public y: number) {
    }

    add(p: Point) {
        this.x += p.x
        this.y += p.y
    }

    sub(p: Point) {
        this.x -= p.x
        this.y -= p.y
    }

    inRect(leftTop: Point, bottomRight: Point): boolean {
        return leftTop.x <= this.x
            && leftTop.y <= this.y
            && this.x <= bottomRight.x
            && this.y <= bottomRight.y
    }

    equal(p: Point): boolean {
        return this.x == p.x && this.y == p.y
    }

}

export { Point }


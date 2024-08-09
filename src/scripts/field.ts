import { Direction, FigureType, Figure } from "./figures.js"
import { Point } from "./utils/point.js"

class CellInfo {

    constructor(public field: Field) {
    }

}

class FigureToElementMapper {

    private readonly figureToElement = new Map()

    private readonly elementToFigure = new Map()

    public bind(figure: Figure, element: HTMLElement) {
	this.figureToElement.set(figure, element)
	this.elementToFigure.set(element, figure)
    }

    public getFigure(element: HTMLElement): Figure {
	return this.elementToFigure.get(element)
    }

    public getElement(figure: Figure): HTMLElement {
	return this.figureToElement.get(figure)
    }

}

class Field {

    readonly nRows: number

    readonly nCols: number

    readonly heightPercentage: number

    readonly field: HTMLElement

    screenWidth: number

    screenHeight: number

    height: number

    width: number

    cellSideSize: number

    figuresTopLeft: Point

    figureXGap: number

    figureYGap: number

    chosenFigure: Figure | null = null

    figureToElementMapper = new FigureToElementMapper()

    constructor() {
        this.nRows = 4
        this.nCols = 3

        this.heightPercentage = 0.7

        this.field = document.getElementById("field") as HTMLElement

        this.screenWidth = globalThis.innerWidth
        this.screenHeight = globalThis.innerHeight

        this.height = this.screenHeight * this.heightPercentage
        this.cellSideSize = this.height / this.nRows
        this.width = this.cellSideSize * this.nCols

        this.figuresTopLeft = new Point(
            (this.screenWidth - this.width)/2, 
            (this.screenHeight - this.height)/2
        )

        this.figureXGap = 0
        this.figureYGap = 0

	this.generateCellElements()
    }

    getHighlightedCells(type: FigureType, figureCoords: Point) {
	return type.moves
	    .map(m =>
		new Point(m.x + figureCoords.x, m.y + figureCoords.y))
	    .filter(m =>
		m.x > 0 && m.y > 0 && m.x <= this.nCols && m.y <= this.nRows)
    }

    calculate() {
    }

    calculateFigurePos(row: number, col: number) {
	return this.calculateCellPos(row, col)
    }

    calculateCellPos(row: number, col: number) {
        const x = this.figuresTopLeft.x + (this.cellSideSize + this.figureXGap)*(col - 1)
        const y = this.figuresTopLeft.y + (this.cellSideSize + this.figureYGap)*(row - 1)

        return new Point(x, y)
    }

    createFigureElement(figure: Figure) {
        const figureElement = document.createElement("div")

        const sideSizeStr = this.cellSideSize.toString() + "px"

        const assetPath = "assets/" + figure.type.assetName + ".png"

        figureElement.style.height = sideSizeStr
        figureElement.style.width = sideSizeStr
        figureElement.style.backgroundImage = `url("${assetPath}")`
        figureElement.style.backgroundSize = "contain"
        figureElement.style.position = "absolute"
        figureElement.style.display = "block"

	if (figure.direction == Direction.DOWN) {
	    figureElement.style.transform = "rotate(180deg)"
	}

	const field = this

	figureElement.onmousedown = function(_event) {
	    const highlightedCells = field.getHighlightedCells(figure.type, figure.coords)
	    field.unhighlighCells()
	    field.drawHighlightedCells(highlightedCells)
	    field.chosenFigure = figure
	};

        this.field.appendChild(figureElement)

	this.figureToElementMapper.bind(figure, figureElement)

	return figureElement
    }

    drawFigure(figure: HTMLElement, coords: Point) {
        const screenPos = this.calculateFigurePos(coords.x, coords.y)

        figure.style.top = screenPos.y.toString() + "px" 
        figure.style.left = screenPos.x.toString() + "px" 
    }

    draw(figures: Figure[]) {
	for (const figure of figures) {
	    const figureElement = this.createFigureElement(figure)
	    this.drawFigure(figureElement, figure.coords)
	}

	this.drawHighlightedCells([])
    }

    getCellId(coords: Point) {
	return `cell-${coords.x}-${coords.y}`
    }

    generateCellElement(coords: Point) {
        const cellElement = document.createElement("div")

        const sideSizeStr = this.cellSideSize.toString() + "px"

        cellElement.style.height = sideSizeStr
        cellElement.style.width = sideSizeStr
        cellElement.style.position = "absolute"
        cellElement.style.display = "block"

        const screenPos = this.calculateCellPos(coords.x, coords.y)

        cellElement.style.top = screenPos.y.toString() + "px" 
        cellElement.style.left = screenPos.x.toString() + "px" 

	cellElement.id = this.getCellId(coords)
	cellElement.style.backgroundColor = "green"
	cellElement.style.opacity = "0"

	const cellInfo = new CellInfo(this)

	cellElement.onmousedown = function(_event) {
	    if (!cellInfo.field.chosenFigure) {
		return
	    }

	    cellInfo.field.chosenFigure.coords = coords
	    cellInfo.field.unhighlighCells()
	};

	return cellElement
    }

    putFigure(figure: HTMLElement, coords: Point) {
        const screenPos = this.calculateFigurePos(coords.x, coords.y)

        figure.style.top = screenPos.y.toString() + "px" 
        figure.style.left = screenPos.x.toString() + "px" 
    }

    moveFigure(figure: Figure, newCoords: Point) {

    }

    generateCellElements() {
	for (let i = 0; i < this.nRows; i++) {
	    for (let j = 0; j < this.nCols; j++) {
		const cellElement = this.generateCellElement(new Point(i + 1, j + 1))
		this.field.appendChild(cellElement)
	    }
	}
    }

    unhighlighCells() {
	for (let i = 0; i < this.nRows; i++) {
	    for (let j = 0; j < this.nCols; j++) {
		const cellElement = document.getElementById(this.getCellId(new Point(i + 1, j + 1))) as HTMLElement
		cellElement.style.opacity = "0"
	    }
	}
    }

    drawHighlightedCells(highlightedCells: Point[]) {
	for (const cell of highlightedCells) {
	    const cellElement = document.getElementById(this.getCellId(cell)) as HTMLElement
	    cellElement.style.opacity = "1"
	}
    }

}

export { Field }


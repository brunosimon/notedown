import Position from './Position.js'

export default class Cursor
{
    constructor(_options)
    {
        // Options
        this.root = _options.root
        this.root.cursor = this

        // Element
        this.$element = document.createElement('div')
        this.$element.classList.add('cursor')
        this.$element.classList.add('animated')
        this.root.lines.$element.appendChild(this.$element)

        // Bar
        this.$bar = document.createElement('div')
        this.$bar.classList.add('bar')
        this.$element.appendChild(this.$bar)

        // Set
        this.position = new Position()

        // Set interactions
        this.setInteractions()
    }

    goRight()
    {
        const line = this.root.lines.items[this.position.lineIndex]
        const position = new Position(this.position.lineIndex, this.position.rowIndex + 1)

        // Last row
        if(this.position.rowIndex + 1 > line.length)
        {
            if(this.position.lineIndex < this.root.lines.length - 1)
            {
                position.rowIndex = 0
                position.lineIndex = this.position.lineIndex + 1
            }
            else
            {
                position.lineIndex = this.position.lineIndex
                position.rowIndex = this.position.rowIndex
            }
        }

        this.setPosition(position)
    }

    goLeft()
    {
        const position = new Position(this.position.lineIndex, this.position.rowIndex - 1)

        // First row
        if(this.position.rowIndex - 1 < 0)
        {
            if(this.position.lineIndex > 0)
            {
                const previousLine = this.root.lines.items[this.position.lineIndex - 1]
                position.rowIndex = previousLine.length
                position.lineIndex = this.position.lineIndex - 1
            }
            else
            {
                position.lineIndex = this.position.lineIndex
                position.rowIndex = this.position.rowIndex
            }
        }

        this.setPosition(position)
    }

    goUp()
    {
        const position = new Position(this.position.lineIndex - 1, this.position.rowIndex)

        // First line
        if(this.position.lineIndex - 1 < 0)
        {
            position.rowIndex = 0
            position.lineIndex = 0
        }

        // Not first line
        else
        {
            const previousLine = this.root.lines.items[this.position.lineIndex - 1]

            if(this.position.rowIndex > previousLine.length)
            {
                position.rowIndex = previousLine.length
            }
        }

        this.setPosition(position)
    }

    goDown()
    {
        const position = new Position(this.position.lineIndex + 1, this.position.rowIndex)

        // Last line
        if(this.position.lineIndex + 1 > this.root.lines.length - 1)
        {
            const line = this.root.lines.items[this.position.lineIndex]
            position.rowIndex = line.length
            position.lineIndex = this.position.lineIndex
        }

        // Not last line
        else
        {
            const nextLine = this.root.lines.items[this.position.lineIndex + 1]

            if(this.position.rowIndex > nextLine.length)
            {
                position.rowIndex = nextLine.length
            }
        }

        this.setPosition(position)
    }

    setPosition(_position)
    {
        this.position.copy(_position)

        const x = this.position.rowIndex * this.root.measures.rowWidth
        const y = this.position.lineIndex * this.root.measures.lineHeight

        this.$element.style.transform = `translateX(${x}px) translateY(${y}px)`

        this.resetAnimation()
    }

    resetAnimation()
    {
        this.$element.removeChild(this.$bar)
        this.$element.appendChild(this.$bar)
    }

    setInteractions()
    {
        this.interactions = {}
        this.interactions.mousedown = (_event) =>
        {
            const position = this.root.lines.getPosition(_event.clientX, _event.clientY)
            this.setPosition(position)

            window.addEventListener('mousemove', this.interactions.mousemove)
            window.addEventListener('mouseup', this.interactions.mouseup)
        }

        this.interactions.mousemove = (_event) =>
        {
            const position = this.root.lines.getPosition(_event.clientX, _event.clientY)
            this.setPosition(position)
        }

        this.interactions.mouseup = () =>
        {
            window.removeEventListener('mousemove', this.interactions.mousemove)
            window.removeEventListener('mouseup', this.interactions.mousemove)
        }

        // Mousedown
        this.root.lines.$element.addEventListener('mousedown', this.interactions.mousedown)
    }
}

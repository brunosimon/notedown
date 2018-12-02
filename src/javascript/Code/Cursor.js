export default class Cursor
{
    constructor(_options)
    {
        this.measures = _options.measures

        // Element
        this.$element = document.createElement('div')
        this.$element.classList.add('cursor')

        // Bar
        this.$bar = document.createElement('div')
        this.$bar.classList.add('bar')
        this.$element.appendChild(this.$bar)

        // Set
        this.active = false

        this.position = { line: 0, row: 0 }
        this.start = { line: 0, row: 0 }
        this.end = { line: 0, row: 0 }
    }

    setPosition(_position)
    {
        const x = _position.rowIndex * this.measures.width
        const y = _position.lineIndex * this.measures.height

        this.$element.style.transform = `translateX(${x}px) translateY(${y}px)`
    }
}

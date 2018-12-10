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

    setPosition(_position)
    {
        this.position.copy(_position)

        const x = this.position.rowIndex * this.root.measures.rowWidth
        const y = this.position.lineIndex * this.root.measures.lineHeight

        this.$element.style.transform = `translateX(${x}px) translateY(${y}px)`
        this.$element.classList.remove('animated')

        window.requestAnimationFrame(() =>
        {
            this.$element.classList.add('animated')
        })
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

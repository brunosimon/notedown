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
        this.position = { lineIndex: 0, rowIndex: 0 }

        // Set interactions
        this.setInteractions()
    }

    setPosition(_position)
    {
        this.position.lineIndex = _position.lineIndex
        this.position.rowIndex = _position.rowIndex

        const x = _position.rowIndex * this.root.measures.rowWidth
        const y = _position.lineIndex * this.root.measures.lineHeight

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

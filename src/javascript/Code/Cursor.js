export default class Cursor
{
    constructor(_options)
    {
        // Options
        this.measures = _options.measures

        // Element
        this.$element = document.createElement('div')
        this.$element.classList.add('cursor')

        // Bar
        this.$bar = document.createElement('div')
        this.$bar.classList.add('bar')
        this.$element.appendChild(this.$bar)

        // Set
        this.position = { lineIndex: 0, rowIndex: 0 }
    }

    setPosition(_position)
    {
        this.position.lineIndex = _position.lineIndex
        this.position.rowIndex = _position.rowIndex

        const x = _position.rowIndex * this.measures.rowWidth
        const y = _position.lineIndex * this.measures.lineHeight

        this.$element.style.transform = `translateX(${x}px) translateY(${y}px)`
        this.$element.classList.remove('animated')

        window.requestAnimationFrame(() =>
        {
            this.$element.classList.add('animated')
        })
    }
}

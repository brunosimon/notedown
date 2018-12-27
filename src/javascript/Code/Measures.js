import Line from './Line.js'

export default class Measures
{
    constructor(_options)
    {
        // Options
        this.root = _options.root
        this.root.measures = this

        // Set up
        this.rowWidth = null
        this.lineHeight = null
        this.count = 1000

        // Create invisible dummy line
        this.line = new Line('0'.repeat(this.count))
        this.line.$element.classList.add('dummy')
        this.root.lines.$element.appendChild(this.line.$element)

        // Update
        this.update()
    }

    update()
    {
        this.rowWidth = this.line.fragments.$element.offsetWidth / this.count
        this.lineHeight = this.line.$element.offsetHeight
    }
}

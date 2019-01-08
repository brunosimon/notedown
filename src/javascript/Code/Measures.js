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

        // Font ready callback
        if(document.fonts && document.fonts.ready)
        {
            document.fonts.ready.then(() =>
            {
                // Update
                this.update()
            })
        }

        // Update
        this.update()
    }

    update()
    {
        this.root.lines.$element.appendChild(this.line.$element)

        this.rowWidth = this.line.fragments.$element.offsetWidth / this.count
        this.lineHeight = this.line.$element.offsetHeight

        this.root.lines.$element.removeChild(this.line.$element)
    }
}

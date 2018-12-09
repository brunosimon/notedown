export default class Selection
{
    constructor(_options)
    {
        // Options
        this.root = _options.root
        this.root.selection = this

        // Set up
        this.direction = 'normal'
        this.start = { lineIndex: 0, rowIndex: 0 }
        this.end = { lineIndex: 0, rowIndex: 0 }

        // Set interactions
        this.setInteractions()
    }

    setInteractions()
    {
        this.interactions = {}

        this.interactions.mousedown = (_event) =>
        {
            this.start = this.root.lines.getPosition(_event.clientX, _event.clientY)
            this.end = { ...this.start }

            this.root.lines.updateSelection(this)

            window.addEventListener('mousemove', this.interactions.mousemove)
            window.addEventListener('mouseup', this.interactions.mouseup)
        }

        this.interactions.mousemove = (_event) =>
        {
            this.end = this.root.lines.getPosition(_event.clientX, _event.clientY)

            if(this.end.lineIndex < this.start.lineIndex || this.end.lineIndex === this.start.lineIndex && this.end.rowIndex < this.start.rowIndex)
            {
                this.direction = 'reverse'
            }
            else
            {
                this.direction = 'normal'
            }

            this.root.lines.updateSelection(this)
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

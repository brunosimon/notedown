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

            this.updateLines(this)

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

            this.updateLines(this)
        }

        this.interactions.mouseup = () =>
        {
            window.removeEventListener('mousemove', this.interactions.mousemove)
            window.removeEventListener('mouseup', this.interactions.mousemove)
        }

        // Mousedown
        this.root.lines.$element.addEventListener('mousedown', this.interactions.mousedown)
    }

    updateLines()
    {
        const start = this.direction === 'normal' ? this.start : this.end
        const end = this.direction === 'normal' ? this.end : this.start

        const lines = this.root.lines.items.slice(start.lineIndex, end.lineIndex + 1)
        const otherLines = [ ...this.root.lines.items.slice(0, start.lineIndex), ...this.root.lines.items.slice(end.lineIndex + 1, this.root.lines.items.length) ] //

        // One line
        if(lines.length === 1)
        {
            const line = lines[0]

            line.updateSelection(start.rowIndex * this.root.measures.rowWidth, end.rowIndex * this.root.measures.rowWidth)
        }
        else
        {
            for(let i = 0; i < lines.length; i++)
            {
                const line = lines[i]

                // First
                if(i === 0)
                {
                    line.updateSelection(start.rowIndex * this.root.measures.rowWidth, line.originalText.length * this.root.measures.rowWidth)
                }
                // Last
                else if(i === lines.length - 1)
                {
                    line.updateSelection(0, end.rowIndex * this.root.measures.rowWidth)
                }
                // Between
                else
                {
                    line.updateSelection(0, line.originalText.length * this.root.measures.rowWidth)
                }
            }
        }

        for(const _line of otherLines)
        {
            _line.updateSelection(0, 0)
        }
    }
}

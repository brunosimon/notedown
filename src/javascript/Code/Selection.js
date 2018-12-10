import Range from './Range'

export default class Selection
{
    constructor(_options)
    {
        // Options
        this.root = _options.root
        this.root.selection = this

        // Set up
        this.range = new Range()

        // Set interactions
        this.setInteractions()
    }

    setInteractions()
    {
        this.interactions = {}

        this.interactions.mousedown = (_event) =>
        {
            const position = this.root.lines.getPosition(_event.clientX, _event.clientY)
            this.range.start.copy(position)
            this.range.end.copy(position)

            this.updateLines(this)

            window.addEventListener('mousemove', this.interactions.mousemove)
            window.addEventListener('mouseup', this.interactions.mouseup)
        }

        this.interactions.mousemove = (_event) =>
        {
            this.range.end.copy(this.root.lines.getPosition(_event.clientX, _event.clientY))

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
        const range = this.range.clone()
        range.normalize()

        const lines = this.root.lines.items.slice(range.start.lineIndex, range.end.lineIndex + 1)
        const otherLines = [ ...this.root.lines.items.slice(0, range.start.lineIndex), ...this.root.lines.items.slice(range.end.lineIndex + 1, this.root.lines.items.length) ] //

        // One line
        if(lines.length === 1)
        {
            const line = lines[0]

            line.updateSelection(range.start.rowIndex * this.root.measures.rowWidth, range.end.rowIndex * this.root.measures.rowWidth)
        }
        else
        {
            for(let i = 0; i < lines.length; i++)
            {
                const line = lines[i]

                // First
                if(i === 0)
                {
                    line.updateSelection(range.start.rowIndex * this.root.measures.rowWidth, line.originalText.length * this.root.measures.rowWidth)
                }
                // Last
                else if(i === lines.length - 1)
                {
                    line.updateSelection(0, range.end.rowIndex * this.root.measures.rowWidth)
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

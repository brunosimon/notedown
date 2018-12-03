import Line from './Line.js'

export default class Lines
{
    constructor()
    {
        // Container
        this.$element = document.createElement('div')
        this.$element.classList.add('lines')

        // Set up
        this.items = []
        this.setMeasures()
    }

    add(_text = '')
    {
        const line = new Line(_text)
        this.$element.appendChild(line.$element)
        this.items.push(line)
    }

    setMeasures()
    {
        this.measures = {}
        this.measures.rowWidth = null
        this.measures.lineHeight = null
        this.measures.line = new Line('0')
        this.measures.line.$element.classList.add('dummy')

        this.$element.appendChild(this.measures.line.$element)
    }

    updateMeasures()
    {
        this.measures.rowWidth = this.measures.line.parts.$element.offsetWidth
        this.measures.lineHeight = this.measures.line.$element.offsetHeight
    }

    updateSelection(_selection)
    {
        const start = _selection.direction === 'normal' ? _selection.start : _selection.end
        const end = _selection.direction === 'normal' ? _selection.end : _selection.start

        const lines = this.items.slice(start.lineIndex, end.lineIndex + 1)
        const otherLines = [ ...this.items.slice(0, start.lineIndex), ...this.items.slice(end.lineIndex + 1, this.items.length) ] //

        // One line
        if(lines.length === 1)
        {
            const line = lines[0]

            line.updateSelection(start.rowIndex * this.measures.rowWidth, end.rowIndex * this.measures.rowWidth)
        }
        else
        {
            for(let i = 0; i < lines.length; i++)
            {
                const line = lines[i]

                // First
                if(i === 0)
                {
                    line.updateSelection(start.rowIndex * this.measures.rowWidth, line.originalText.length * this.measures.rowWidth)
                }
                // Last
                else if(i === lines.length - 1)
                {
                    line.updateSelection(0, end.rowIndex * this.measures.rowWidth)
                }
                // Between
                else
                {
                    line.updateSelection(0, line.originalText.length * this.measures.rowWidth)
                }
            }
        }

        for(const _line of otherLines)
        {
            _line.updateSelection(0, 0)
        }
    }
}

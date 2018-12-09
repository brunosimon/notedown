import Line from './Line.js'

export default class Lines
{
    constructor(_options)
    {
        this.root = _options.root
        this.root.lines = this

        // Container
        this.$element = document.createElement('div')
        this.$element.classList.add('lines')
        this.root.scroll.$inner.appendChild(this.$element)

        // Set up
        this.items = []
        this.setMeasures()
    }

    add(_text = '')
    {
        const line = new Line(_text)
        this.$element.appendChild(line.$element)
        this.items.push(line)

        return line
    }

    remove(_line)
    {
        const lineIndex = this.items.indexOf(_line)

        // Found
        if(lineIndex !== - 1)
        {
            _line.$element.remove()
            this.items.splice(lineIndex, 1)
        }
    }

    setMeasures()
    {
        // Set up
        this.measures = {}
        this.measures.rowWidth = null
        this.measures.lineHeight = null

        // Create invisible dummy line
        this.measures.line = new Line('0')
        this.measures.line.$element.classList.add('dummy')
        this.$element.appendChild(this.measures.line.$element)

        // Update measures
        this.updateMeasures()
    }

    updateMeasures()
    {
        this.measures.rowWidth = this.measures.line.fragments.$element.offsetWidth
        this.measures.lineHeight = this.measures.line.$element.offsetHeight
    }

    getPosition(_x, _y)
    {
        let lineIndex = null
        let rowIndex = null

        let beforeFirstLine = false
        let afterLastLine = false

        /**
         * Line
         */
        lineIndex = Math.floor(_y / this.measures.lineHeight)

        // Before first line
        if(lineIndex < 0)
        {
            beforeFirstLine = true
            lineIndex = 0
        }

        // After last line
        else if(lineIndex > this.items.length - 1)
        {
            afterLastLine = true
            lineIndex = this.items.length - 1
        }

        /**
         * Row
         */
        // Before first line
        if(beforeFirstLine)
        {
            rowIndex = 0
        }
        // After last line
        else if(afterLastLine)
        {
            // Has no line
            if(this.items.length === 0)
            {
                rowIndex = 0
            }
            // Last line
            else
            {
                const lastLine = this.items[this.items.length - 1]
                rowIndex = lastLine.originalText.length
            }
        }
        // Between first and last line
        else
        {
            rowIndex = Math.round(_x / this.measures.rowWidth)

            const line = this.items[lineIndex]

            if(rowIndex < 0)
            {
                rowIndex = 0
            }
            else if(rowIndex > line.originalText.length)
            {
                rowIndex = line.originalText.length
            }
        }

        return {
            lineIndex,
            rowIndex
        }
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

    clearText(_range)
    {
        const start = _range.direction === 'normal' ? _range.start : _range.end
        const end = _range.direction === 'normal' ? _range.end : _range.start

        const lines = this.items.slice(start.lineIndex, end.lineIndex + 1)

        // One line
        if(lines.length === 1)
        {
            const line = lines[0]

            const before = line.originalText.slice(0, start.rowIndex)
            const after = line.originalText.slice(end.rowIndex, line.originalText.length)
            const text = `${before}${after}`

            line.updateText(text)
        }
        else
        {
            const before = lines[0].originalText.slice(0, start.rowIndex)
            const after = lines[lines.length - 1].originalText.slice(end.rowIndex, lines[lines.length - 1].originalText.length)
            const text = `${before}${after}`

            lines[0].updateText(text)

            for(let i = 1; i < lines.length; i++)
            {
                const line = lines[i]
                this.remove(line)
            }
        }
    }

    updateText(_text, _position)
    {
        const line = this.items[_position.lineIndex]

        const before = line.originalText.slice(0, _position.rowIndex)
        const after = line.originalText.slice(_position.rowIndex, line.originalText.length)
        const text = `${before}${_text}${after}`
        line.updateText(text)
    }
}

import Position from './Position.js'
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
        this.length = 0
    }

    addLine(_text = '')
    {
        const line = new Line(_text)

        this.$element.appendChild(line.$element)

        this.items.push(line)

        this.length = this.items.length

        return line
    }

    removeLine(_line)
    {
        const lineIndex = this.items.indexOf(_line)

        // Found
        if(lineIndex !== - 1)
        {
            _line.$element.remove()
            this.items.splice(lineIndex, 1)

            this.length = this.items.length
        }
    }

    getPosition(_x, _y)
    {
        const position = new Position()

        let beforeFirstLine = false
        let afterLastLine = false

        /**
         * Line
         */
        position.lineIndex = Math.floor(_y / this.root.measures.lineHeight)

        // Before first line
        if(position.lineIndex < 0)
        {
            beforeFirstLine = true
            position.lineIndex = 0
        }

        // After last line
        else if(position.lineIndex > this.items.length - 1)
        {
            afterLastLine = true
            position.lineIndex = this.items.length - 1
        }

        /**
         * Row
         */
        // Before first line
        if(beforeFirstLine)
        {
            position.rowIndex = 0
        }
        // After last line
        else if(afterLastLine)
        {
            // Has no line
            if(this.items.length === 0)
            {
                position.rowIndex = 0
            }
            // Last line
            else
            {
                const lastLine = this.items[this.items.length - 1]
                position.rowIndex = lastLine.originalText.length
            }
        }
        // Between first and last line
        else
        {
            position.rowIndex = Math.round(_x / this.root.measures.rowWidth)

            const line = this.items[position.lineIndex]

            if(position.rowIndex < 0)
            {
                position.rowIndex = 0
            }
            else if(position.rowIndex > line.originalText.length)
            {
                position.rowIndex = line.originalText.length
            }
        }

        return position
    }

    removeRange(_range)
    {
        let start = null
        let end = null

        if(_range.start.lineIndex !== _range.end.lineIndex)
        {
            start = _range.start.lineIndex < _range.end.lineIndex ? _range.start : _range.end
            end = _range.start.lineIndex < _range.end.lineIndex ? _range.end : _range.start
        }
        else
        {
            start = _range.start.rowIndex < _range.end.rowIndex ? _range.start : _range.end
            end = _range.start.rowIndex < _range.end.rowIndex ? _range.end : _range.start
        }

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
                this.removeLine(line)
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

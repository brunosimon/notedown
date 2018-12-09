import Line from './Line.js'
import Inputs from './Inputs.js'
import Cursor from './Cursor.js'

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
        this.setSelection()
        this.setInputs()
        this.setCursor()
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
        this.measures = {}
        this.measures.rowWidth = null
        this.measures.lineHeight = null
        this.measures.line = new Line('0')
        this.measures.line.$element.classList.add('dummy')

        this.$element.appendChild(this.measures.line.$element)
    }

    updateMeasures()
    {
        this.measures.rowWidth = this.measures.line.fragments.$element.offsetWidth
        this.measures.lineHeight = this.measures.line.$element.offsetHeight
    }

    setSelection()
    {
        this.selection = {}
        this.selection.direction = 'normal'
        this.selection.start = { lineIndex: 0, rowIndex: 0 }
        this.selection.end = { lineIndex: 0, rowIndex: 0 }

        // Events callback
        const mousedown = (_event) =>
        {
            this.selection.start = this.getPosition(_event.clientX, _event.clientY)
            this.selection.end = { ...this.selection.start }

            this.updateSelection(this.selection)

            window.addEventListener('mousemove', mousemove)
            window.addEventListener('mouseup', mouseup)
        }
        const mousemove = (_event) =>
        {
            this.selection.end = this.getPosition(_event.clientX, _event.clientY)

            if(this.selection.end.lineIndex < this.selection.start.lineIndex || this.selection.end.lineIndex === this.selection.start.lineIndex && this.selection.end.rowIndex < this.selection.start.rowIndex)
            {
                this.selection.direction = 'reverse'
            }
            else
            {
                this.selection.direction = 'normal'
            }

            this.updateSelection(this.selection)
        }
        const mouseup = () =>
        {
            window.removeEventListener('mousemove', mousemove)
            window.removeEventListener('mouseup', mousemove)
        }

        // Mousedown
        this.$element.addEventListener('mousedown', mousedown)
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

    setInputs()
    {
        this.inputs = new Inputs()
        this.$element.appendChild(this.inputs.textarea.$element)

        this.inputs.on('input', (_value) =>
        {
            // Clear text at selection
            this.clearText(this.selection)

            // Reset cursor
            this.cursor.setPosition(this.selection.start)

            // Update text
            this.updateText(_value, this.cursor.position)

            // Move cursor
            this.cursor.setPosition({ lineIndex: this.cursor.position.lineIndex, rowIndex: this.cursor.position.rowIndex + 1 })

            // Reset selection
            this.selection.start.lineIndex = this.cursor.position.lineIndex
            this.selection.start.rowIndex = this.cursor.position.rowIndex
            this.selection.end.lineIndex = this.cursor.position.lineIndex
            this.selection.end.rowIndex = this.cursor.position.rowIndex
            this.updateSelection(this.selection)
        })

        this.$element.addEventListener('mouseup', () =>
        {
            this.inputs.focus()
        })
    }

    setCursor()
    {
        this.cursor = new Cursor({
            measures: this.measures
        })
        this.$element.appendChild(this.cursor.$element)

        // Events callback
        const mousedown = (_event) =>
        {
            const position = this.getPosition(_event.clientX, _event.clientY)
            this.cursor.setPosition(position)

            window.addEventListener('mousemove', mousemove)
            window.addEventListener('mouseup', mouseup)
        }
        const mousemove = (_event) =>
        {
            const position = this.getPosition(_event.clientX, _event.clientY)
            this.cursor.setPosition(position)
        }
        const mouseup = () =>
        {
            window.removeEventListener('mousemove', mousemove)
            window.removeEventListener('mouseup', mousemove)
        }

        // Mousedown
        this.$element.addEventListener('mousedown', mousedown)
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

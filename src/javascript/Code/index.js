import Lines from './Lines.js'
import Line from './Line.js'
import Textarea from './Textarea.js'
import Cursor from './Cursor.js'

export default class Code
{
    constructor()
    {
        this.setContainer()
        this.setLines()
        this.setMeasures()
        this.setCursor()
        this.setTextarea()
    }

    setCursor()
    {
        this.cursor = new Cursor({
            measures: this.measures
        })
        this.container.$element.appendChild(this.cursor.$element)
    }

    setContainer()
    {
        this.container = {}

        // Element
        this.container.$element = document.createElement('div')
        this.container.$element.classList.add('code')
        document.body.appendChild(this.container.$element)

        // Mousedown
        this.container.$element.addEventListener('mousedown', (_event) =>
        {
            const position = this.getPosition(_event.clientX, _event.clientY)
            this.cursor.setPosition(position)

            console.log('position', position)
        })
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
        lineIndex = Math.floor(_y / this.measures.height)

        // Before first line
        if(lineIndex < 0)
        {
            beforeFirstLine = true
            lineIndex = 0
        }

        // After last line
        else if(lineIndex > this.lines.items.length - 1)
        {
            afterLastLine = true
            lineIndex = this.lines.items.length - 1
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
            if(this.lines.items.length === 0)
            {
                rowIndex = 0
            }
            // Last line
            else
            {
                const lastLine = this.lines.items[this.lines.items.length - 1]
                rowIndex = lastLine.originalText.length
            }
        }
        // Between first and last line
        else
        {
            rowIndex = Math.round(_x / this.measures.width)

            const line = this.lines.items[lineIndex]

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

    setTextarea()
    {
        this.textarea = new Textarea()
        this.container.$element.appendChild(this.textarea.$element)
    }

    setLines()
    {
        this.lines = new Lines()
        this.container.$element.appendChild(this.lines.$element)
    }

    setMeasures()
    {
        this.measures = {}
        this.measures.width = this.lines.dummy.line.parts.$element.offsetWidth
        this.measures.height = this.lines.dummy.line.$element.offsetHeight
    }

    destruct()
    {
        this.container.$element.remove()
    }
}

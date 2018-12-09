import Lines from './Lines.js'
import Textarea from './Textarea.js'
import Cursor from './Cursor.js'
import Scroll from './Scroll.js'

export default class Code
{
    constructor()
    {
        this.setContainer()
        this.setScroll()
        this.setLines()
        this.setCursor()
        this.setTextarea()
        this.setSelection()

        // Test lines
        const texts = [
            // '    - [x] Test (parenthese) Yop (again)',
            '# Title',
            '    ## Sub title',
            '(parenthesis)',
            '[brackets]',
            '    [brackets]',
            '(parenthesis) coucou [brackets] (parenthesis)',

            'http://google.fr',
            'https://google.fr?toto=tata',
            'https://google.fr?toto=tata#hash',
            'https://google.fr/search?toto=tata#hash',
            'https://google.fr/search/keyword?toto=tata&tutu=titi#hash',
            'file:///Users/brunosimon/Sites/notedown/src/index.html',
            'Toto http://google.fr tata',
            'Toto (http://google.fr)',

            // '    ## Subtitle',
            // '',
            '        - [x] Toto 1',
            '        - [x] Toto 1 http://google.fr',
            '        - [x] Toto 1 (parenthesis)',
            '        - [x] Toto 1 [parenthesis]',
            '        - [x] Toto 1 [parenthesis http://google.fr]',
            '        - [!] Toto 2',
            '        - [?] Toto 2',
            '        - [-] Toto 2',
            '        - [ ] Toto 3',
            '',
            'lorem ipsum doloresorem ipsum doloresorem ipsum doloresorem ipsum doloresorem ipsum doloresorem ipsum doloresorem ipsum doloresorem ipsum dolores',
            'Before *I am strong* after',
            'Before "I am a quote" after',
            'Before ~I am a striked~ after',
            '// Comment',
            'Hey // Comment after test',
            '- [x] Toto 1 // Comment',
            '(parenthesis // Comment)'
        ]

        for(const _text of texts)
        {
            this.lines.add(_text)
        }

        // const line = this.lines.add()

        // window.setInterval(() =>
        // {
        //     line.updateText(texts[Math.floor(Math.random() * texts.length)])
        // }, 1000)

        // for(let i = 0; i < 100; i++)
        // {
        //     this.lines.add(`Test ${i}`)
        // }
    }

    setCursor()
    {
        this.cursor = new Cursor({
            measures: this.lines.measures
        })
        this.scroll.$inner.appendChild(this.cursor.$element)

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
        this.container.$element.addEventListener('mousedown', mousedown)
    }

    setContainer()
    {
        this.container = {}

        // Element
        this.container.$element = document.createElement('div')
        this.container.$element.classList.add('code')
        document.body.appendChild(this.container.$element)
    }

    setScroll()
    {
        this.scroll = new Scroll()
        this.container.$element.appendChild(this.scroll.$element)
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
        lineIndex = Math.floor(_y / this.lines.measures.lineHeight)

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
            rowIndex = Math.round(_x / this.lines.measures.rowWidth)

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
        // this.textarea = new Textarea()
        // this.container.$element.appendChild(this.textarea.$element)
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

            this.lines.updateSelection(this.selection)

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

            this.lines.updateSelection(this.selection)
        }
        const mouseup = () =>
        {
            window.removeEventListener('mousemove', mousemove)
            window.removeEventListener('mouseup', mousemove)
        }

        // Mousedown
        this.container.$element.addEventListener('mousedown', mousedown)
    }

    setLines()
    {
        this.lines = new Lines()
        this.scroll.$inner.appendChild(this.lines.$element)
        this.lines.updateMeasures()
    }

    destruct()
    {
        this.container.$element.remove()
    }
}

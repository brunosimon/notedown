import Scroll from './Scroll.js'
import Lines from './Lines.js'
import Measures from './Measures.js'
import Cursor from './Cursor.js'
import Actions from './Actions.js'
import Inputs from './Inputs.js'
import History from './History.js'
import EventEmitter from '../EventEmitter.js'

export default class Code extends EventEmitter
{
    constructor()
    {
        super()

        this.setContainer()
        this.setScroll()
        this.setLines()
        this.setMeasures()
        this.setCursor()
        this.setActions()
        this.setInputs()
        this.setHistory()
        // this.setDemo()
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
        new Scroll({
            root: this
        })
    }

    setLines()
    {
        new Lines({
            root: this
        })
    }

    setMeasures()
    {
        new Measures({
            root: this
        })
    }

    setCursor()
    {
        new Cursor({
            root: this
        })
    }

    setActions()
    {
        this.actions = new Actions({
            root: this
        })
    }

    setInputs()
    {
        this.inputs = new Inputs({
            root: this
        })
    }

    setHistory()
    {
        this.lastState = null
        this.history = new History({
            root: this
        })
    }

    setDemo()
    {
        // Test lines
        const texts = [
            'aa',
            'bb',
            'cc',
            'dd',
            '  aa bb cc dd ee',
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

            '    ## Subtitle',
            '',
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

        this.lines.addText(texts.join('\n'))

        const line = this.lines.addLine()

        window.setInterval(() =>
        {
            line.updateText(texts[Math.floor(Math.random() * texts.length)])
        }, 1000)

        for(let i = 0; i < 100; i++)
        {
            this.lines.addLine(`Test ${i}`)
        }
    }

    getState()
    {
        const state = {}

        // Text
        state.text = this.lines.getText()

        // Cursor
        state.cursorPosition = this.cursor.position.clone()

        // Selection
        state.selectionRange = this.lines.selectionRange.clone().normalize()

        // Scroll
        state.scroll = {}
        state.scroll.x = this.scroll.offset.x
        state.scroll.y = this.scroll.offset.y

        return state
    }

    setState(_state)
    {
        // Text
        if(_state.text)
        {
            this.lines.empty()
            this.lines.addText(_state.text)
        }

        // Cursor
        if(_state.cursorPosition)
        {
            this.cursor.setPosition(_state.cursorPosition)
        }

        // Selection
        if(_state.selectionRange)
        {
            this.lines.updateSelection(_state.selectionRange.start, _state.selectionRange.end)
        }

        // Scroll
        if(_state.scroll)
        {
            this.scroll.setOffset(_state.scroll.x, _state.scroll.y)
        }
    }

    destruct()
    {
        this.container.$element.remove()
    }
}

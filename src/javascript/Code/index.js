import Lines from './Lines.js'
import Measures from './Measures.js'
import Cursor from './Cursor.js'
import Scroll from './Scroll.js'
import Inputs from './Inputs.js'
import Actions from './Actions.js'

export default class Code
{
    constructor()
    {
        this.setContainer()
        this.setScroll()
        this.setLines()
        this.setMeasures()
        this.setCursor()
        this.setActions()
        this.setInputs()

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
            this.lines.addLine(_text)
        }

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
        this.inputs = new Actions({
            root: this
        })
    }

    setInputs()
    {
        this.inputs = new Inputs({
            root: this
        })
    }

    destruct()
    {
        this.container.$element.remove()
    }
}

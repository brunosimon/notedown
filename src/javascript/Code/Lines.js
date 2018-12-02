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
        this.setDummy()

        // Test lines
        this.add('Toto 1')
        this.add('Toto 2')
        this.add('Toto 3')
    }

    add(_text = '')
    {
        const line = new Line(_text)
        this.$element.appendChild(line.$element)
        this.items.push(line)
    }

    setDummy()
    {
        this.dummy = {}
        this.dummy.line = new Line('0')
        this.dummy.line.$element.classList.add('dummy')

        this.$element.appendChild(this.dummy.line.$element)
    }
}

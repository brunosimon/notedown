import Line from './Line.js'

export default class Lines
{
    constructor()
    {
        // Container
        this.$element = document.createElement('div')
        this.$element.classList.add('lines')

        // Items
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

        line.$element.addEventListener('click', (_event) =>
        {
            const row = Math.floor(_event.clientX / this.dummy.width)
            const index = this.items.indexOf(line)
            console.log('index', index)
            console.log('row', row)
        })
    }

    setDummy()
    {
        this.dummy = {}
        this.dummy.line = new Line('0')
        this.dummy.width = 0
        this.dummy.line.$element.classList.add('dummy')

        this.$element.appendChild(this.dummy.line.$element)

        window.requestAnimationFrame(() =>
        {
            this.dummy.width = this.dummy.line.$text.offsetWidth
        })
    }
}

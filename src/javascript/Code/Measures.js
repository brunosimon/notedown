import Line from './Line.js'

export default class Measures
{
    constructor(_options)
    {
        // Options
        this.root = _options.root
        this.root.measures = this

        this.setPadding()
        this.setCharacter()
        this.setViewport()
    }

    setPadding()
    {
        this.padding = {}
        this.padding.top = null
        this.padding.right = null
        this.padding.bottom = null
        this.padding.left = null
        this.padding.update = () =>
        {
            const computedStyle = window.getComputedStyle(this.root.scroll.$inner)
            this.padding.top = parseFloat(computedStyle.paddingTop)
            this.padding.right = parseFloat(computedStyle.paddingRight)
            this.padding.bottom = parseFloat(computedStyle.paddingBottom)
            this.padding.left = parseFloat(computedStyle.paddingLeft)
        }

        window.addEventListener('resize', this.padding.update)
        this.padding.update()
    }

    setCharacter()
    {
        this.character = {}
        this.character.width = null
        this.character.height = null

        // Create invisible dummy line
        this.character.dummy = {}
        this.character.dummy.count = 1000
        this.character.dummy.line = new Line('0'.repeat(this.character.dummy.count))
        this.character.dummy.line.$element.classList.add('dummy')

        this.character.update = () =>
        {
            this.root.lines.$element.appendChild(this.character.dummy.line.$element)

            this.character.width = this.character.dummy.line.fragments.$element.offsetWidth / this.character.dummy.count
            this.character.height = this.character.dummy.line.$element.offsetHeight

            this.root.lines.$element.removeChild(this.character.dummy.line.$element)
        }

        // Font ready callback
        if(document.fonts && document.fonts.ready)
        {
            document.fonts.ready.then(() =>
            {
                // Update
                this.character.update()
            })
        }

        // Update
        this.character.update()
    }

    setViewport()
    {
        this.viewport = {}

        this.viewport.width = null
        this.viewport.height = null

        this.viewport.update = () =>
        {
            this.viewport.width = window.innerWidth
            this.viewport.height = window.innerHeight
        }

        window.addEventListener('resize', this.viewport.update)
        this.viewport.update()
    }
}

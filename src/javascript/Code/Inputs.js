import EventEmitter from './EventEmitter.js'

export default class Inputs extends EventEmitter
{
    constructor(_options)
    {
        super()

        this.root = _options.root
        this.root.inputs = this

        this.setTextarea()
    }

    setTextarea()
    {
        this.textarea = {}

        // Element
        this.textarea.$element = document.createElement('textarea')
        this.textarea.$element.classList.add('textarea')
        this.root.container.$element.appendChild(this.textarea.$element)

        this.textarea.$element.addEventListener('input', () =>
        {
            const value = this.textarea.$element.value[0]
            this.textarea.$element.value = ''

            this.trigger('input', [ value ])
        })

        this.root.lines.$element.addEventListener('mouseup', () =>
        {
            this.focus()
        })
    }

    focus()
    {
        this.textarea.$element.focus()
    }
}

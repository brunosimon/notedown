import EventEmitter from './EventEmitter.js'

export default class Inputs extends EventEmitter
{
    constructor()
    {
        super()

        this.setTextarea()
    }

    setTextarea()
    {
        this.textarea = {}

        // Element
        this.textarea.$element = document.createElement('textarea')
        this.textarea.$element.classList.add('textarea')

        this.textarea.$element.addEventListener('input', () =>
        {
            const value = this.textarea.$element.value[0]
            this.textarea.$element.value = ''

            this.trigger('input', [ value ])
        })
    }

    focus()
    {
        this.textarea.$element.focus()
    }
}

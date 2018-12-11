import Keyboard from './Keyboard.js'

export default class Inputs
{
    constructor(_options)
    {
        this.root = _options.root
        this.root.inputs = this

        this.setShortcuts()
        this.setTextarea()
        this.setKeyboard()
    }

    setShortcuts()
    {
        this.shortcuts = {}
        this.shortcuts.items = []

        this.addShortcut([ 'cmd', 'right' ], () =>
        {
            this.root.actions.endLine()
        })
        this.addShortcut([ 'cmd', 'left' ], () =>
        {
            this.root.actions.startLine()
        })
        this.addShortcut([ 'right' ], () =>
        {
            this.root.actions.right()
        })
        this.addShortcut([ 'up' ], () =>
        {
            this.root.actions.up()
        })
        this.addShortcut([ 'down' ], () =>
        {
            this.root.actions.down()
        })
        this.addShortcut([ 'left' ], () =>
        {
            this.root.actions.left()
        })
        this.addShortcut([ 'cmd', 'c' ], () =>
        {
            this.root.actions.copy()
        })
    }

    addShortcut(_inputs, _method)
    {
        this.shortcuts.items.push({ inputs: _inputs, method: _method })
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
            const value = this.textarea.$element.value
            this.textarea.$element.value = ''

            this.root.actions.input(value)
        })

        this.root.lines.$element.addEventListener('mouseup', () =>
        {
            this.focus()
        })
    }

    setKeyboard()
    {
        this.keyboard = new Keyboard()

        this.keyboard.on('down', (_keyCode, _character, _downItems) =>
        {
            for(const _item of this.shortcuts.items)
            {
                if(this.keyboard.isDown(_item.inputs, _downItems))
                {
                    _item.method()

                    break
                }
            }
        })
    }

    focus()
    {
        this.textarea.$element.focus()
    }
}

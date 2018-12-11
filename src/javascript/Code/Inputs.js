import EventEmitter from './EventEmitter.js'
import Keyboard from './Keyboard.js'

export default class Inputs extends EventEmitter
{
    constructor(_options)
    {
        super()

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

        this.addShortcut([ 'right' ], () =>
        {
            this.right()
        })
        this.addShortcut([ 'up' ], () =>
        {
            this.up()
        })
        this.addShortcut([ 'down' ], () =>
        {
            this.down()
        })
        this.addShortcut([ 'left' ], () =>
        {
            this.left()
        })
        this.addShortcut([ 'cmd', 'c' ], () =>
        {
            this.copy()
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
            const value = this.textarea.$element.value[0]
            this.textarea.$element.value = ''

            this.trigger('input', [ value ])
        })

        this.root.lines.$element.addEventListener('mouseup', () =>
        {
            this.focus()
        })
    }

    setKeyboard()
    {
        this.keyboard = new Keyboard()

        this.keyboard.on('down', () =>
        {
            for(const _item of this.shortcuts.items)
            {
                if(this.keyboard.isDown(_item.inputs))
                {
                    _item.method()
                }
            }
        })
    }

    focus()
    {
        this.textarea.$element.focus()
    }

    right()
    {
        // Cursor
        this.root.cursor.goRight()

        // Selection
        this.root.selection.update(this.root.cursor.position, this.root.cursor.position)
    }

    down()
    {
        // Cursor
        this.root.cursor.goDown()

        // Selection
        this.root.selection.update(this.root.cursor.position, this.root.cursor.position)
    }

    left()
    {
        // Cursor
        this.root.cursor.goLeft()

        // Selection
        this.root.selection.update(this.root.cursor.position, this.root.cursor.position)
    }

    up()
    {
        // Cursor
        this.root.cursor.goUp()

        // Selection
        this.root.selection.update(this.root.cursor.position, this.root.cursor.position)
    }

    copy()
    {
        // Get text for range
        const text = this.root.lines.getText(this.root.selection.range)

        // Create textarea and copy value
        const textarea = document.createElement('textarea')
        textarea.value = text
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)

        // Focus back
        this.focus()
    }
}

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
        this.setPointer()
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
        this.addShortcut([ 'cmd', 'a' ], () =>
        {
            this.root.actions.selectAll()
        })
        this.addShortcut([ 'cmd', 'backspace' ], () =>
        {
            this.root.actions.superDeleteCharacter()
        })
        this.addShortcut([ 'backspace' ], () =>
        {
            this.root.actions.deleteCharacter()
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

    setPointer()
    {
        this.pointer = {}
        this.pointer.mousedown = (_event) =>
        {
            // Pointer down action
            this.root.actions.pointerDown(_event.clientX, _event.clientY)

            // Double click action
            if(_event.detail === 2)
            {
                this.root.actions.selectWord()
            }

            // Double click action
            else if(_event.detail === 3)
            {
                this.root.actions.selectLine()
            }

            // Events
            window.addEventListener('mousemove', this.pointer.mousemove)
            window.addEventListener('mouseup', this.pointer.mouseup)
        }

        this.pointer.mousemove = (_event) =>
        {
            // Pointer move action
            this.root.actions.pointerMove(_event.clientX, _event.clientY)
        }

        this.pointer.mouseup = () =>
        {
            window.removeEventListener('mousemove', this.pointer.mousemove)
            window.removeEventListener('mouseup', this.pointer.mousemove)
        }

        // Mousedown
        this.root.lines.$element.addEventListener('mousedown', this.pointer.mousedown)
    }

    focus()
    {
        this.textarea.$element.focus()
    }
}

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
        this.setLinks()
        this.setPointer()

        this.focus()
    }

    setShortcuts()
    {
        this.shortcuts = {}
        this.shortcuts.items = []

        this.addShortcut([ 'command', 'shift', 'z' ], () =>
        {
            this.root.actions.redo()

            return false
        })
        this.addShortcut([ 'command', 'z' ], () =>
        {
            this.root.actions.undo()

            return false
        })
        this.addShortcut([ 'command', 'right' ], () =>
        {
            this.root.actions.cursorEndOfLine(this.keyboard.isDown('shift'))
        })
        this.addShortcut([ 'command', 'left' ], () =>
        {
            this.root.actions.cursorStartOfLine(this.keyboard.isDown('shift'))
        })
        this.addShortcut([ 'alt', 'right' ], () =>
        {
            this.root.actions.cursorRightWord(this.keyboard.isDown('shift'))
        })
        this.addShortcut([ 'alt', 'left' ], () =>
        {
            this.root.actions.cursorLeftWord(this.keyboard.isDown('shift'))
        })
        this.addShortcut([ 'right' ], () =>
        {
            this.root.actions.cursorRight(this.keyboard.isDown('shift'))
        })
        this.addShortcut([ 'up' ], () =>
        {
            this.root.actions.cursorUp(this.keyboard.isDown('shift'))
        })
        this.addShortcut([ 'down' ], () =>
        {
            this.root.actions.cursorDown(this.keyboard.isDown('shift'))
        })
        this.addShortcut([ 'left' ], () =>
        {
            this.root.actions.cursorLeft(this.keyboard.isDown('shift'))
        })
        this.addShortcut([ 'command', 'c' ], () =>
        {
            this.root.actions.copy()
        })
        this.addShortcut([ 'command', 'x' ], () =>
        {
            this.root.actions.cut()
        })
        this.addShortcut([ 'command', 'a' ], () =>
        {
            this.root.actions.selectAll()
        })
        this.addShortcut([ 'command', 'backspace' ], () =>
        {
            this.root.actions.superDeleteLeft()
        })
        this.addShortcut([ 'backspace' ], () =>
        {
            this.root.actions.deleteLeft()
        })
        this.addShortcut([ 'command', 'delete' ], () =>
        {
            this.root.actions.superDeleteRight()
        })
        this.addShortcut([ 'delete' ], () =>
        {
            this.root.actions.deleteRight()
        })
        this.addShortcut([ 'tab' ], () =>
        {
            this.root.actions.tabulate()

            return false
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

        let latestWasAccent = false

        this.textarea.$element.addEventListener('input', () =>
        {
            const value = this.textarea.$element.value

            // Handle accents
            if((value === '^' || value === '¨') && !latestWasAccent)
            {
                latestWasAccent = true
                return
            }

            latestWasAccent = false

            // Reset textarea
            this.textarea.$element.value = ''

            // Send input
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
                    return _item.method()

                    break
                }
            }
        })
    }

    setLinks()
    {
        // Add class when command is down
        this.keyboard.on('down', (_keyCode, _character) =>
        {
            if(_character === 'command')
            {
                this.root.container.$element.classList.add('is-command-down')
            }
        })

        // Remove class when command is down
        this.keyboard.on('up', (_keyCode, _character) =>
        {
            if(_character === 'command')
            {
                this.root.container.$element.classList.remove('is-command-down')
            }
        })
    }

    setPointer()
    {
        this.pointer = {}
        this.pointer.mousedown = (_event) =>
        {
            // Pointer down action
            this.root.actions.pointerDown(_event.clientX + this.root.scroll.offset.x, _event.clientY + this.root.scroll.offset.y, this.keyboard.isDown('shift'))

            // Double click action
            if(_event.detail === 2)
            {
                this.root.actions.pointerDoubleDown(_event.clientX + this.root.scroll.offset.x, _event.clientY + this.root.scroll.offset.y, this.keyboard.isDown('shift'))
            }

            // Double click action
            else if(_event.detail === 3)
            {
                this.root.actions.pointerTripleDown(_event.clientX + this.root.scroll.offset.x, _event.clientY + this.root.scroll.offset.y, this.keyboard.isDown('shift'))
            }

            // Events
            window.addEventListener('mousemove', this.pointer.mousemove)
            window.addEventListener('mouseup', this.pointer.mouseup)
        }

        this.pointer.mousemove = (_event) =>
        {
            // Pointer move action
            this.root.actions.pointerMove(_event.clientX + this.root.scroll.offset.x, _event.clientY + this.root.scroll.offset.y)
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

    copy(_text)
    {
        // Create textarea and copy value
        const textarea = document.createElement('textarea')
        textarea.value = _text
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')

        // Remove textarea
        document.body.removeChild(textarea)

        // Focus back
        this.root.inputs.focus()
    }
}

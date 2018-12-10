import EventEmitter from './EventEmitter.js'
import Keyboard from './Keyboard.js'

export default class Inputs extends EventEmitter
{
    constructor(_options)
    {
        super()

        this.root = _options.root
        this.root.inputs = this

        this.setTextarea()
        this.setKeyboard()
        this.setKeyMapping()
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
            if(this.keyboard.isDown('up'))
            {
                this.up()
            }
            if(this.keyboard.isDown('right'))
            {
                this.right()
            }
            if(this.keyboard.isDown('down'))
            {
                this.down()
            }
            if(this.keyboard.isDown('left'))
            {
                this.left()
            }
            if(this.keyboard.isDown([ 'cmd', 'c' ]))
            {
                console.log('copy')
            }
        })
    }

    setKeyMapping()
    {
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
}

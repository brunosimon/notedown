import EventEmitter from './EventEmitter.js'

export default class Keyboard extends EventEmitter
{
    constructor()
    {
        super()

        this.knownKeyNames = {
            8: 'backspace',
            9: 'tab',
            13: 'enter',
            16: 'shift',
            17: 'ctrl',
            18: 'alt',
            20: 'caps',
            27: 'esc',
            32: 'space',
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down',
            91: 'cmd'
        }

        this.downItems = []

        this.setInteractions()
    }

    setInteractions()
    {
        // Down
        const keydownHandle = (_event) =>
        {
            const character = this.keycodeToCharacter(_event.keyCode)

            if(!this.downItems.includes(character))
            {
                this.downItems.push(character)
            }

            const trigger = this.trigger('down', [ _event.keyCode, character ])

            // Trigger and prevend default if asked by return false on callback
            if(trigger === false)
            {
                _event.preventDefault()
            }
        }

        // Up
        const keyupHandle = (_event) =>
        {
            const character = this.keycodeToCharacter(_event.keyCode)

            if(this.downItems.indexOf(character) !== - 1)
            {
                this.downItems.splice(this.downItems.indexOf(character), 1)
            }

            if(character === 'cmd')
            {
                this.downItems = []
            }

            this.trigger('up', [ _event.keyCode, character ])
        }


        // Listen
        document.addEventListener('keydown', keydownHandle)
        document.addEventListener('keyup', keyupHandle)
    }

    keycodeToCharacter(_keycode)
    {
        let character = this.knownKeyNames[ _keycode ]

        if(!character)
        {
            character = String.fromCharCode(_keycode).toLowerCase()
        }

        return character
    }

    isDown(_inputs)
    {
        let inputs = _inputs instanceof Array ? _inputs : [ _inputs ]
        inputs = inputs.map((_item) => typeof _item === 'number' ? this.keycodeToCharacter(_item) : _item)

        return inputs.every((_item) =>
        {
            return this.downItems.includes(_item)
        })
    }
}

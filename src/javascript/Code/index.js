import Lines from './Lines.js'
import Textarea from './Textarea.js'
import Cursor from './Cursor.js'

export default class Code
{
    constructor()
    {
        this.setContainer()
        this.setCursor()
        this.setTextarea()
        this.setLines()
    }

    setCursor()
    {
        this.cursor = new Cursor()
        this.container.$element.appendChild(this.cursor.$element)
    }

    setContainer()
    {
        this.container = {}

        // Element
        this.container.$element = document.createElement('div')
        this.container.$element.classList.add('code')
        document.body.appendChild(this.container.$element)
    }

    setTextarea()
    {
        this.textarea = new Textarea()
        this.container.$element.appendChild(this.textarea.$element)
    }

    setLines()
    {
        this.lines = new Lines()
        this.container.$element.appendChild(this.lines.$element)
    }

    destruct()
    {
        this.container.$element.remove()
    }
}

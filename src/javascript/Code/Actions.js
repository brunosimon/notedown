import Position from './Position'

export default class Actions
{
    constructor(_options)
    {
        this.root = _options.root
        this.root.actions = this
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

    startLine()
    {
        const cursorPosition = this.root.cursor.position.clone()
        cursorPosition.rowIndex = 0
        this.root.cursor.setPosition(cursorPosition)
    }

    endLine()
    {
        const line = this.root.lines.items[this.root.cursor.position.lineIndex]

        const cursorPosition = this.root.cursor.position.clone()
        cursorPosition.rowIndex = line.length
        this.root.cursor.setPosition(cursorPosition)
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
        this.root.inputs.focus()
    }

    input(_value)
    {
        // Get normalized selection range
        const selectionRange = this.root.selection.range.clone().normalize()

        // Add text at range
        this.root.lines.addTextAtRange(_value, selectionRange)

        // Move cursor
        const cursorPosition = this.root.cursor.position.clone()
        cursorPosition.rowIndex = selectionRange.start.rowIndex + _value.length
        this.root.cursor.setPosition(cursorPosition)

        // Reset selection
        this.root.selection.update(this.root.cursor.position, this.root.cursor.position)
    }

    selectAll()
    {
        const lastLine = this.root.lines.items[this.root.lines.items.length - 1]
        const startPosition = new Position(0, 0)
        const endPosition = new Position(this.root.lines.items.length - 1, lastLine.length)

        this.root.selection.update(startPosition, endPosition)
        this.root.cursor.setPosition(endPosition)
    }
}

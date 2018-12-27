import Position from './Position'

export default class Actions
{
    constructor(_options)
    {
        this.root = _options.root
        this.root.actions = this
    }

    cursorRight()
    {
        // Cursor
        this.root.cursor.goRight()

        // Selection
        this.root.lines.updateSelection(this.root.cursor.position, this.root.cursor.position)
    }

    cursorDown()
    {
        // Cursor
        this.root.cursor.goDown()

        // Selection
        this.root.lines.updateSelection(this.root.cursor.position, this.root.cursor.position)
    }

    cursorLeft()
    {
        // Cursor
        this.root.cursor.goLeft()

        // Selection
        this.root.lines.updateSelection(this.root.cursor.position, this.root.cursor.position)
    }

    cursorUp()
    {
        // Cursor
        this.root.cursor.goUp()

        // Selection
        this.root.lines.updateSelection(this.root.cursor.position, this.root.cursor.position)
    }

    cursorRightWord()
    {
        // Get line
        let lineIndex = this.root.cursor.position.lineIndex
        let rowIndex = this.root.cursor.position.rowIndex
        let line = this.root.lines.items[lineIndex]

        if(this.root.cursor.position.rowIndex === line.length)
        {
            if(lineIndex === this.root.lines.length - 1)
            {
                return
            }
            else
            {
                lineIndex++
                line = this.root.lines.items[lineIndex]
                rowIndex = 0
            }
        }

        // Get character
        const character = line.text[rowIndex]

        // Same character condition
        let condition = null

        if(character.match(/[a-zA-Z0-1_\s]/i))
        {
            condition = (_character) => _character.match(/[a-zA-Z0-1_]/i)
        }
        else
        {
            condition = (_character) => _character === character
        }

        // Right index
        let rightIndex = rowIndex + 1
        let rightCharacter = line.text[rightIndex]
        let skipSpaces = character.match(/\s/i)

        while(rightIndex < line.length && (condition(rightCharacter) || skipSpaces))
        {
            rightIndex = rightIndex + 1
            rightCharacter = line.text[rightIndex]

            if(skipSpaces && rightCharacter)
            {
                skipSpaces = rightCharacter.match(/\s/i)
            }
        }

        // Position
        const position = new Position(lineIndex, rightIndex)

        // Cursor
        this.root.cursor.setPosition(position)

        // Selection
        this.root.lines.updateSelection(this.root.cursor.position, this.root.cursor.position)
    }

    cursorLeftWord()
    {
        // Get line
        let lineIndex = this.root.cursor.position.lineIndex
        let rowIndex = this.root.cursor.position.rowIndex
        let line = this.root.lines.items[lineIndex]

        if(this.root.cursor.position.rowIndex === 0)
        {
            if(lineIndex === 0)
            {
                return
            }
            else
            {
                lineIndex--
                line = this.root.lines.items[lineIndex]
                rowIndex = line.length
            }
        }

        // Get character
        const character = line.text[rowIndex - 1]

        // Same character condition
        let condition = null

        if(character.match(/[a-zA-Z0-1_\s]/i))
        {
            condition = (_character) => _character.match(/[a-zA-Z0-1_]/i)
        }
        else
        {
            condition = (_character) => _character === character
        }

        // Left index
        let leftIndex = rowIndex - 1
        let leftCharacter = line.text[leftIndex]
        let skipSpaces = character.match(/\s/i)

        while(leftIndex >= 0 && (condition(leftCharacter) || skipSpaces))
        {
            leftIndex = leftIndex - 1
            leftCharacter = line.text[leftIndex]

            if(skipSpaces && leftCharacter)
            {
                skipSpaces = leftCharacter.match(/\s/i)
            }
        }

        leftIndex++

        // Position
        const position = new Position(lineIndex, leftIndex)

        // Cursor
        this.root.cursor.setPosition(position)

        // Selection
        this.root.lines.updateSelection(this.root.cursor.position, this.root.cursor.position)
    }

    pointerDown(_x, _y, _extendSelection = false)
    {
        // Position
        const position = this.root.lines.getPosition(_x, _y)

        // Cursor
        this.root.cursor.setPosition(position)

        // Selection
        const start = _extendSelection ? this.root.lines.selectionRange.start : position
        const end = position
        this.root.lines.updateSelection(start, end)
    }

    pointerMove(_x, _y)
    {
        // Position
        const position = this.root.lines.getPosition(_x, _y)

        // Cursor
        this.root.cursor.setPosition(position)

        // Selection
        const selectionRange = this.root.lines.selectionRange.clone()
        selectionRange.end.copy(position)

        this.root.lines.updateSelection(selectionRange.start, selectionRange.end)
    }

    doubleDown(_x, _y, _extendSelection = false)
    {
        const position = this.root.lines.getPosition(_x, _y)
        const line = this.root.lines.items[position.lineIndex]

        // Empty line
        if(line.length === 0)
        {
            return
        }

        // Find character at position
        let x = Math.round((_x - this.root.measures.rowWidth * 0.5) / this.root.measures.rowWidth)

        if(x < 0)
        {
            x = 0
        }
        else if(x > line.length - 1)
        {
            x = line.length - 1
        }

        const character = line.text[x]

        // Same character condition
        let condition = null

        if(character.match(/[a-zA-Z0-1_]/i))
        {
            condition = (_character) => _character.match(/[a-zA-Z0-1_]/i)
        }
        else
        {
            condition = (_character) => _character === character
        }

        // Left index
        let leftIndex = x - 1
        let leftCharacter = line.text[leftIndex]

        while(leftIndex >= 0 && condition(leftCharacter))
        {
            leftIndex = leftIndex - 1
            leftCharacter = line.text[leftIndex]
        }

        leftIndex++

        // Right index
        let rightIndex = x + 1
        let rightCharacter = line.text[rightIndex]

        while(rightIndex < line.length && condition(rightCharacter))
        {
            rightIndex = rightIndex + 1
            rightCharacter = line.text[rightIndex]
        }

        // Update selection
        const start = _extendSelection ? this.root.lines.selectionRange.start : new Position(position.lineIndex, leftIndex)
        const end = new Position(position.lineIndex, rightIndex)
        this.root.lines.updateSelection(start, end)

        // Update cursor
        this.root.cursor.setPosition(end)
    }

    tripleDown(_x, _y, _extendSelection = false)
    {
        const position = this.root.lines.getPosition(_x, _y)
        const line = this.root.lines.items[position.lineIndex]

        // Update selection
        const start = _extendSelection ? this.root.lines.selectionRange.start : new Position(this.root.cursor.position.lineIndex, 0)
        const end = new Position(this.root.cursor.position.lineIndex, line.length)
        this.root.lines.updateSelection(start, end)

        // Update cursor
        this.root.cursor.setPosition(end)
    }

    startLine()
    {
        // Update cursor position
        const cursorPosition = this.root.cursor.position.clone()
        cursorPosition.rowIndex = 0
        this.root.cursor.setPosition(cursorPosition)

        // Reset selection
        this.root.lines.updateSelection(this.root.cursor.position, this.root.cursor.position)
    }

    endLine()
    {
        // Get line
        const line = this.root.lines.items[this.root.cursor.position.lineIndex]

        // Update cursor position
        const cursorPosition = this.root.cursor.position.clone()
        cursorPosition.rowIndex = line.length
        this.root.cursor.setPosition(cursorPosition)

        // Reset selection
        this.root.lines.updateSelection(this.root.cursor.position, this.root.cursor.position)
    }

    deleteCharacter()
    {
        const line = this.root.lines.items[this.root.cursor.position.lineIndex]
        const cursorPosition = this.root.cursor.position.clone()
        const before = line.text.slice(0, cursorPosition.rowIndex)

        // Has characters to delete
        if(before.length > 0)
        {
            line.removeText(cursorPosition.rowIndex - 1, cursorPosition.rowIndex)

            this.root.cursor.goLeft()
        }

        // No character to delete
        else if(this.root.cursor.position.lineIndex > 0)
        {
            // Remove current line
            this.root.lines.removeLine(line)

            // Move cursor
            this.root.cursor.goLeft()

            // Add rest of line at the end of previous line
            const after = line.text.slice(cursorPosition.rowIndex, line.length)
            const previousLine = this.root.lines.items[this.root.cursor.position.lineIndex]
            previousLine.addText(after)
        }

        // Reset selection
        this.root.lines.updateSelection(this.root.cursor.position, this.root.cursor.position)
    }

    superDeleteCharacter()
    {
        const line = this.root.lines.items[this.root.cursor.position.lineIndex]
        const cursorPosition = this.root.cursor.position.clone()
        const before = line.text.slice(0, cursorPosition.rowIndex)

        // Has characters to delete
        if(before.length > 0)
        {
            line.removeText(0, cursorPosition.rowIndex)
            cursorPosition.rowIndex = 0

            this.root.cursor.setPosition(cursorPosition)
        }

        // No character to delete
        else if(this.root.cursor.position.lineIndex > 0)
        {
            // Remove current line
            this.root.lines.removeLine(line)

            // Move cursor
            this.root.cursor.goLeft()

            // Add rest of line at the end of previous line
            const after = line.text.slice(cursorPosition.rowIndex, line.length)
            const previousLine = this.root.lines.items[this.root.cursor.position.lineIndex]
            previousLine.addText(after)
        }

        // Reset selection
        this.root.lines.updateSelection(this.root.cursor.position, this.root.cursor.position)
    }

    copy()
    {
        // Get text for range
        const text = this.root.lines.getText(this.root.lines.selectionRange)

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
        const selectionRange = this.root.lines.selectionRange.clone().normalize()

        // Add text at range
        const update = this.root.lines.addTextAtRange(_value, selectionRange)

        // Text
        const textLines = _value.split(/\r?\n/g)

        // Move cursor
        const cursorPosition = this.root.cursor.position.clone()
        cursorPosition.lineIndex = selectionRange.start.lineIndex + textLines.length - 1

        if(textLines.length === 1)
        {
            cursorPosition.rowIndex = selectionRange.start.rowIndex + textLines[textLines.length - 1].length
        }
        else
        {
            cursorPosition.rowIndex = textLines[textLines.length - 1].length
        }
        cursorPosition.rowIndex += update.indent.length

        this.root.cursor.setPosition(cursorPosition)

        // Reset selection
        this.root.lines.updateSelection(cursorPosition, cursorPosition)
    }

    selectAll()
    {
        const lastLine = this.root.lines.items[this.root.lines.items.length - 1]
        const startPosition = new Position(0, 0)
        const endPosition = new Position(this.root.lines.items.length - 1, lastLine.length)

        this.root.lines.updateSelection(startPosition, endPosition)
        this.root.cursor.setPosition(endPosition)
    }
}

import Position from './Position'
import Range from './Range'
import Line from './Line'
import EventEmitter from '../EventEmitter'

export default class Actions extends EventEmitter
{
    constructor(_options)
    {
        super()

        this.root = _options.root
        this.root.actions = this
    }

    undo()
    {
        this.root.history.undo()

        // Trigger
        this.trigger('action', [ 'undo' ])
    }

    redo()
    {
        this.root.history.redo()

        // Trigger
        this.trigger('action', [ 'redo' ])
    }

    cursorRight(_extendSelection = false)
    {
        if(!this.root.lines.selectionRange.isEmpty() && !_extendSelection)
        {
            // Update cursor
            const selectionRange = this.root.lines.selectionRange.clone().normalize()
            this.root.cursor.setPosition(selectionRange.end)

            // Update selection
            this.root.lines.updateSelection(this.root.cursor.position, this.root.cursor.position)
        }
        else
        {
            // Update cursor
            this.root.cursor.goRight()

            // Update selection
            const start = _extendSelection ? this.root.lines.selectionRange.start : this.root.cursor.position
            const end = this.root.cursor.position
            this.root.lines.updateSelection(start, end)
        }
        // Trigger
        this.trigger('action', [ 'cursorRight' ])
    }

    cursorDown(_extendSelection = false)
    {
        // Update cursor
        this.root.cursor.goDown()

        // Update selection
        const start = _extendSelection ? this.root.lines.selectionRange.start : this.root.cursor.position
        const end = this.root.cursor.position
        this.root.lines.updateSelection(start, end)

        // Trigger
        this.trigger('action', [ 'cursorDown' ])
    }

    cursorLeft(_extendSelection = false)
    {
        if(!this.root.lines.selectionRange.isEmpty() && !_extendSelection)
        {
            // Update cursor
            const selectionRange = this.root.lines.selectionRange.clone().normalize()
            this.root.cursor.setPosition(selectionRange.start)

            // Update selection
            this.root.lines.updateSelection(this.root.cursor.position, this.root.cursor.position)
        }
        else
        {
            // Update cursor
            this.root.cursor.goLeft()

            // Update selection
            const start = _extendSelection ? this.root.lines.selectionRange.start : this.root.cursor.position
            const end = this.root.cursor.position
            this.root.lines.updateSelection(start, end)
        }

        // Trigger
        this.trigger('action', [ 'cursorLeft' ])
    }

    cursorUp(_extendSelection = false)
    {
        // Update cursor
        this.root.cursor.goUp()

        // Update selection
        const start = _extendSelection ? this.root.lines.selectionRange.start : this.root.cursor.position
        const end = this.root.cursor.position
        this.root.lines.updateSelection(start, end)

        // Trigger
        this.trigger('action', [ 'cursorUp' ])
    }

    cursorRightWord(_extendSelection = false)
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

        if(character.match(/[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF0-9_\s]/i))
        {
            condition = (_character) => _character.match(/[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF0-9_]/i)
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
        const start = _extendSelection ? this.root.lines.selectionRange.start : this.root.cursor.position
        const end = this.root.cursor.position
        this.root.lines.updateSelection(start, end)

        // Trigger
        this.trigger('action', [ 'cursorRightWord' ])
    }

    cursorLeftWord(_extendSelection = false)
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

        if(character.match(/[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF0-9_\s]/i))
        {
            condition = (_character) => _character.match(/[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF0-9_]/i)
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
        const start = _extendSelection ? this.root.lines.selectionRange.start : this.root.cursor.position
        const end = this.root.cursor.position
        this.root.lines.updateSelection(start, end)

        // Trigger
        this.trigger('action', [ 'cursorLeftWord' ])
    }

    cursorStartOfLine(_extendSelection = false)
    {
        // Update cursor position
        const cursorPosition = this.root.cursor.position.clone()
        cursorPosition.rowIndex = 0
        this.root.cursor.setPosition(cursorPosition)

        // Update selection
        const start = _extendSelection ? this.root.lines.selectionRange.start : this.root.cursor.position
        const end = this.root.cursor.position
        this.root.lines.updateSelection(start, end)

        // Trigger
        this.trigger('action', [ 'cursorStartOfLine' ])
    }

    cursorEndOfLine(_extendSelection = false)
    {
        // Get line
        const line = this.root.lines.items[this.root.cursor.position.lineIndex]

        // Update cursor position
        const cursorPosition = this.root.cursor.position.clone()
        cursorPosition.rowIndex = line.length
        this.root.cursor.setPosition(cursorPosition)

        // Update selection
        const start = _extendSelection ? this.root.lines.selectionRange.start : this.root.cursor.position
        const end = this.root.cursor.position
        this.root.lines.updateSelection(start, end)

        // Trigger
        this.trigger('action', [ 'cursorEndOfLine' ])
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

        // Trigger
        this.trigger('action', [ 'pointerDown' ])
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

        // Trigger
        this.trigger('action', [ 'pointerMove' ])
    }

    pointerDoubleDown(_x, _y, _extendSelection = false)
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

        if(character.match(/[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF0-9_]/i))
        {
            condition = (_character) => _character.match(/[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF0-9_]/i)
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

        // Trigger
        this.trigger('action', [ 'pointerDoubleDown' ])
    }

    pointerTripleDown(_x, _y, _extendSelection = false)
    {
        const position = this.root.lines.getPosition(_x, _y)
        const line = this.root.lines.items[position.lineIndex]

        // Update selection
        const start = _extendSelection ? this.root.lines.selectionRange.start : new Position(this.root.cursor.position.lineIndex, 0)
        const end = new Position(this.root.cursor.position.lineIndex, line.length)
        this.root.lines.updateSelection(start, end)

        // Update cursor
        this.root.cursor.setPosition(end)

        // Trigger
        this.trigger('action', [ 'pointerTripleDown' ])
    }

    selectAll()
    {
        const lastLine = this.root.lines.items[this.root.lines.items.length - 1]
        const startPosition = new Position(0, 0)
        const endPosition = new Position(this.root.lines.items.length - 1, lastLine.length)

        this.root.lines.updateSelection(startPosition, endPosition)
        this.root.cursor.setPosition(endPosition)

        // Trigger
        this.trigger('action', [ 'selectAll' ])
    }

    deleteLeft()
    {
        // History
        this.root.history.saveState()

        // No range selected
        // Delete before
        if(this.root.lines.selectionRange.isEmpty())
        {
            const line = this.root.lines.items[this.root.cursor.position.lineIndex]
            const cursorPosition = this.root.cursor.position.clone()
            const before = line.text.slice(0, cursorPosition.rowIndex)

            // Has characters to delete
            if(before.length > 0)
            {
                const range = new Range(new Position(this.root.cursor.position.lineIndex, cursorPosition.rowIndex - 1), new Position(this.root.cursor.position.lineIndex, cursorPosition.rowIndex))
                this.root.lines.removeRange(range)

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

            // Update selection
            this.root.lines.updateSelection(this.root.cursor.position, this.root.cursor.position)
        }

        // Range selected
        else
        {
            // History
            this.root.history.saveState()

            // Delete range
            this.root.lines.removeRange(this.root.lines.selectionRange)

            // Update cursor
            const selectionRange = this.root.lines.selectionRange.clone().normalize()
            this.root.cursor.setPosition(selectionRange.start)

            // Update selection
            this.root.lines.updateSelection(selectionRange.start, selectionRange.start)
        }

        // Trigger
        this.trigger('action', [ 'deleteLeft' ])
    }

    superDeleteLeft()
    {
        // History
        this.root.history.saveState()

        // No range selected
        // Delete before
        if(this.root.lines.selectionRange.isEmpty())
        {
            const line = this.root.lines.items[this.root.cursor.position.lineIndex]
            const cursorPosition = this.root.cursor.position.clone()
            const before = line.text.slice(0, cursorPosition.rowIndex)

            // Has characters to delete
            if(before.length > 0)
            {
                const range = new Range(new Position(this.root.cursor.position.lineIndex, 0), new Position(this.root.cursor.position.lineIndex, cursorPosition.rowIndex))
                this.root.lines.removeRange(range)
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

            // Update selection
            this.root.lines.updateSelection(this.root.cursor.position, this.root.cursor.position)
        }

        // Range selected
        else
        {
            // History
            this.root.history.saveState()

            // Delete range
            this.root.lines.removeRange(this.root.lines.selectionRange)

            // Update cursor
            const selectionRange = this.root.lines.selectionRange.clone().normalize()
            this.root.cursor.setPosition(selectionRange.start)

            // Update selection
            this.root.lines.updateSelection(selectionRange.start, selectionRange.start)
        }

        // Trigger
        this.trigger('action', [ 'superDeleteLeft' ])
    }

    deleteRight()
    {
        // History
        this.root.history.saveState()

        // No range selected
        // Delete after
        if(this.root.lines.selectionRange.isEmpty())
        {
            const line = this.root.lines.items[this.root.cursor.position.lineIndex]
            const cursorPosition = this.root.cursor.position.clone()
            const after = line.text.slice(cursorPosition.rowIndex, line.text.length)

            // Has characters to delete
            if(after.length > 0)
            {
                const range = new Range(new Position(this.root.cursor.position.lineIndex, cursorPosition.rowIndex), new Position(this.root.cursor.position.lineIndex, cursorPosition.rowIndex + 1))
                this.root.lines.removeRange(range)
            }

            // No character to delete
            else if(this.root.cursor.position.lineIndex < this.root.lines.length - 1)
            {
                // Find next line
                const nextLine = this.root.lines.items[this.root.cursor.position.lineIndex + 1]

                // Add next line text to current line
                line.addText(nextLine.text)

                // Remove current line
                this.root.lines.removeLine(nextLine)
            }

            // Update selection
            this.root.lines.updateSelection(this.root.cursor.position, this.root.cursor.position)
        }

        // Range selected
        else
        {
            // History
            this.root.history.saveState()

            // Delete range
            this.root.lines.removeRange(this.root.lines.selectionRange)

            // Update cursor
            const selectionRange = this.root.lines.selectionRange.clone().normalize()
            this.root.cursor.setPosition(selectionRange.start)

            // Update selection
            this.root.lines.updateSelection(selectionRange.start, selectionRange.start)
        }

        // Trigger
        this.trigger('action', [ 'deleteRight' ])
    }

    superDeleteRight()
    {
        // History
        this.root.history.saveState()

        // No range selected
        // Delete after
        if(this.root.lines.selectionRange.isEmpty())
        {
            const line = this.root.lines.items[this.root.cursor.position.lineIndex]
            const cursorPosition = this.root.cursor.position.clone()
            const after = line.text.slice(cursorPosition.rowIndex, line.text.length)

            // Has characters to delete
            if(after.length > 0)
            {
                const range = new Range(new Position(this.root.cursor.position.lineIndex, cursorPosition.rowIndex), new Position(this.root.cursor.position.lineIndex, line.length))
                this.root.lines.removeRange(range)
                cursorPosition.rowIndex = cursorPosition.rowIndex

                // Update cursor
                this.root.cursor.setPosition(cursorPosition)
            }

            // No character to delete
            else if(this.root.cursor.position.lineIndex < this.root.lines.length - 1)
            {
                // Find next line
                const nextLine = this.root.lines.items[this.root.cursor.position.lineIndex + 1]

                // Add next line text to current line
                line.addText(nextLine.text)

                // Remove current line
                this.root.lines.removeLine(nextLine)
            }

            // Update selection
            this.root.lines.updateSelection(this.root.cursor.position, this.root.cursor.position)
        }

        // Range selected
        else
        {
            // History
            this.root.history.saveState()

            // Delete range
            this.root.lines.removeRange(this.root.lines.selectionRange)

            // Update cursor
            const selectionRange = this.root.lines.selectionRange.clone().normalize()
            this.root.cursor.setPosition(selectionRange.start)

            // Update selection
            this.root.lines.updateSelection(selectionRange.start, selectionRange.start)
        }

        // Trigger
        this.trigger('action', [ 'superDeleteRight' ])
    }

    deleteSelection()
    {
        // History
        this.root.history.saveState()

        // Delete range
        this.root.lines.removeRange(this.root.lines.selectionRange)

        // Update cursor
        const selectionRange = this.root.lines.selectionRange.clone().normalize()
        this.root.cursor.setPosition(selectionRange.start)

        // Update selection
        this.root.lines.updateSelection(selectionRange.start, selectionRange.start)

        // Trigger
        this.trigger('action', [ 'deleteSelection' ])
    }

    copy()
    {
        // Get text for range
        const text = this.root.lines.getText(this.root.lines.selectionRange)

        // Copy
        this.root.inputs.copy(text)

        // Trigger
        this.trigger('action', [ 'copy' ])
    }

    cut()
    {
        // History
        this.root.history.saveState()

        // Get text for range
        const selectionRange = this.root.lines.selectionRange.clone().normalize()
        const text = this.root.lines.getText(selectionRange)

        // Copy
        this.root.inputs.copy(text)

        // Remove range
        this.root.lines.removeRange(selectionRange)

        // Update cursor
        this.root.cursor.setPosition(selectionRange.start)

        // Update selection
        this.root.lines.updateSelection(selectionRange.start, selectionRange.start)

        // Trigger
        this.trigger('action', [ 'copy' ])
    }

    duplicateDown()
    {
        // History
        this.root.history.saveState()

        // Get lines in selection
        const selectionRange = this.root.lines.selectionRange.clone().normalize()
        const lines = this.root.lines.items.slice(selectionRange.start.lineIndex, selectionRange.end.lineIndex + 1)

        // Create new lines
        let i = 0
        for(const _line of lines)
        {
            this.root.lines.addLine(_line.text, selectionRange.end.lineIndex + i)

            i++
        }

        // Update selection
        selectionRange.end.lineIndex += lines.length
        selectionRange.start.lineIndex += lines.length
        this.root.lines.updateSelection(selectionRange.start, selectionRange.end)

        // Update cursor
        this.root.cursor.setPosition(selectionRange.end)
    }

    duplicateUp()
    {

    }

    moveLinesDown()
    {
        // Get lines in selection
        const selectionRange = this.root.lines.selectionRange.clone().normalize()

        // No line before
        if(selectionRange.end.lineIndex > this.root.lines.length - 2)
        {
            return
        }

        // History
        this.root.history.saveState()

        // Get lines
        const firstLine = this.root.lines.items[selectionRange.start.lineIndex]
        const lineAfter = this.root.lines.items[selectionRange.end.lineIndex + 1]

        this.root.lines.$element.insertBefore(lineAfter.$element, firstLine.$element)

        // Move item in array
        this.root.lines.items.splice(selectionRange.end.lineIndex + 1, 1)
        this.root.lines.items.splice(selectionRange.start.lineIndex, 0, lineAfter)

        // Update cursor
        const cursorPosition = this.root.cursor.position.clone()
        cursorPosition.lineIndex += 1
        this.root.cursor.setPosition(cursorPosition)

        // Update selection
        selectionRange.start.lineIndex += 1
        selectionRange.end.lineIndex += 1
        this.root.lines.updateSelection(selectionRange.start, selectionRange.end)
    }

    moveLinesUp()
    {
        // Get lines in selection
        const selectionRange = this.root.lines.selectionRange.clone().normalize()

        // No line before
        if(selectionRange.start.lineIndex === 0)
        {
            return
        }

        // History
        this.root.history.saveState()

        // Get lines
        const lineBefore = this.root.lines.items.slice(selectionRange.start.lineIndex - 1, selectionRange.start.lineIndex)[0]
        const lineAfter = this.root.lines.items[selectionRange.end.lineIndex + 1]

        // Move element in DOM
        if(lineAfter)
        {
            this.root.lines.$element.insertBefore(lineBefore.$element, lineAfter.$element)
        }
        else
        {
            this.root.lines.$element.appendChild(lineBefore.$element)
        }

        // Move item in array
        this.root.lines.items.splice(selectionRange.start.lineIndex - 1, 1)
        this.root.lines.items.splice(selectionRange.end.lineIndex, 0, lineBefore)

        // Update cursor
        const cursorPosition = this.root.cursor.position.clone()
        cursorPosition.lineIndex -= 1
        this.root.cursor.setPosition(cursorPosition)

        // Update selection
        selectionRange.start.lineIndex -= 1
        selectionRange.end.lineIndex -= 1
        this.root.lines.updateSelection(selectionRange.start, selectionRange.end)
    }

    input(_value)
    {
        // No input
        if(_value === '')
        {
            return
        }

        // History
        this.root.history.saveState()

        // Get normalized selection range
        const selectionRange = this.root.lines.selectionRange.clone().normalize()

        // Add text at range
        const update = this.root.lines.addTextAtRange(_value, selectionRange)

        // Text
        const textLines = _value.replace(/\t/g, '    ').split(/\r?\n/g)

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

        // Update cursor
        this.root.cursor.setPosition(cursorPosition)

        // Update selection
        this.root.lines.updateSelection(cursorPosition, cursorPosition)

        // Trigger
        this.trigger('action', [ 'input' ])
    }

    tabulate()
    {
        // History
        this.root.history.saveState()

        const selectionRange = this.root.lines.selectionRange.clone().normalize()
        const lines = this.root.lines.items.slice(selectionRange.start.lineIndex, selectionRange.end.lineIndex + 1)
        const tabSize = 4
        const tabText = ' '.repeat(tabSize)

        // Should indent
        if(lines.length > 1 || (selectionRange.end.rowIndex - selectionRange.start.rowIndex === lines[0].length && lines[0].length > 0))
        {
            for(const _line of lines)
            {
                const text = `${tabText}${_line.text}`
                _line.updateText(text)
            }

            const oldSelectionRange = this.root.lines.selectionRange.clone().normalize()

            // Update selection
            const selectionRange = this.root.lines.selectionRange.clone().normalize()
            selectionRange.end.rowIndex += tabSize
            this.root.lines.updateSelection(selectionRange.start, selectionRange.end)

            // Update cursor
            if(this.root.cursor.position.isEqual(oldSelectionRange.end))
            {
                this.root.cursor.setPosition(selectionRange.end)
            }
        }

        // Should add tabulation in text
        else
        {
            // Get normalized selection range
            const selectionRange = this.root.lines.selectionRange.clone().normalize()

            // Add text at range
            this.root.lines.addTextAtRange(tabText, selectionRange)

            // Update cursor
            const cursorPosition = selectionRange.start
            cursorPosition.rowIndex += tabSize
            this.root.cursor.setPosition(cursorPosition)

            // Update selection
            this.root.lines.updateSelection(this.root.cursor.position, this.root.cursor.position)
        }

        // Trigger
        this.trigger('action', [ 'tabulate' ])
    }
}

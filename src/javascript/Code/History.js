export default class History
{
    constructor(_options)
    {
        this.root = _options.root
        this.root.history = this

        this.saving = false
        this.locked = false
        this.raf = null
        this.states = []
        this.index = 0
        this.limitSize = 256
    }

    getState()
    {
        const state = {}

        // Text
        state.text = this.root.lines.getText()

        // Cursor
        state.cursorPosition = this.root.cursor.position.clone()

        // Selection
        state.selectionRange = this.root.lines.selectionRange.clone().normalize()

        return state
    }

    setState(_index = null)
    {
        const index = _index === null ? this.index : _index
        const state = this.states[index]

        // No state
        if(!state)
        {
            return
        }

        // Lock history
        this.locked = true

        // Text
        this.root.lines.empty()
        this.root.lines.addText(state.text)

        // Cursor
        this.root.cursor.setPosition(state.cursorPosition)

        // Selection
        this.root.lines.updateSelection(state.selectionRange.start, state.selectionRange.end)

        // Unlock history
        this.locked = false
    }

    isStateDifferent(_stateA, _stateB)
    {
        return _stateA.text !== _stateB.text
    }

    saveState()
    {
        // Locked
        if(this.locked)
        {
            return
        }

        // Already saving
        if(this.saving)
        {
            return
        }

        // Compare current state and latest state
        const state = this.getState()
        const latestState = this.states[0]

        // State didn't change
        if(typeof latestState  !== 'undefined' && !this.isStateDifferent(state, latestState))
        {
            return
        }

        // Erase states and reset index
        this.states.splice(0, this.index - 1)
        this.index = 0

        // Save state
        this.states.unshift(state)

        // Trim states
        this.states.splice(this.limitSize, this.states.length)

        this.saving = true

        window.requestAnimationFrame(() =>
        {
            this.saving = false
        })
    }

    undo()
    {
        // Limit
        if(this.index > this.states.length - 1)
        {
            return
        }

        // Update index
        this.index++

        // Set state
        this.setState()
    }

    redo()
    {
        // Limit
        if(this.index <= 0)
        {
            return
        }

        // Update index
        this.index--

        // Set state
        this.setState()
    }
}

import fragmentsConfig from './config/fragments.js'

export default class Line
{
    constructor(_text = '')
    {
        // Element
        this.$element = document.createElement('pre')
        this.$element.classList.add('line')

        // Set up
        this.originalText = null
        this.fragments = []

        // Set initial text
        this.setSelection()
        this.setFragments()
        this.updateText(_text)
    }

    setSelection()
    {
        this.selection = {}
        this.selection.$element = document.createElement('div')
        this.selection.$element.classList.add('selection')
        this.$element.appendChild(this.selection.$element)
    }

    setFragments()
    {
        this.fragments = {}
        this.fragments.$element = document.createElement('div')
        this.fragments.$element.classList.add('fragments')
        this.$element.appendChild(this.fragments.$element)
    }

    updateText(_text)
    {
        // Didn't change
        if(_text === this.originalText)
        {
            return
        }

        // Clear
        while(this.fragments.$element.children.length)
        {
            this.fragments.$element.children[0].remove()
        }

        // Create new fragments
        const fragments = [ ...fragmentsConfig ]
        const fragmentsHTML = this.applyFragments(_text, fragments)

        // Update DOM
        this.fragments.$element.innerHTML = fragmentsHTML

        // Save
        this.originalText = _text
    }

    applyFragments(_text, _fragments)
    {
        let text = _text
        const fragmentIndex = _fragments.findIndex((_item) => text.match(_item.regex))

        // No fragment found (end)
        if(fragmentIndex === -1)
        {
            return text
        }

        // Extract fragment from fragments
        const fragment = _fragments[fragmentIndex]
        const newFragments = [ ..._fragments ]
        newFragments.splice(fragmentIndex, 1)

        // Find matches
        const matches = text.match(fragment.regex)
        text = fragment.replacement

        // Apply fragments to text before and after match
        let beforeText = _text.slice(0, matches.index)
        beforeText = this.applyFragments(beforeText, _fragments)
        let afterText = _text.slice(matches.index + matches[0].length, _text.length)
        afterText = this.applyFragments(afterText, _fragments)

        // Apply fragments to matches parts
        for(let i = 1; i < matches.length; i++)
        {
            let _match = matches[i]
            _match = this.applyFragments(_match, newFragments)
            text = text.replace(`$${i}`, _match)
        }

        // Concatenate
        text = `${beforeText}${text}${afterText}`

        // Return
        return text
    }

    updateSelection(_startX, _endX)
    {
        this.selection.$element.style.left = `${_startX}px`
        this.selection.$element.style.width = `${_endX - _startX}px`
    }
}
